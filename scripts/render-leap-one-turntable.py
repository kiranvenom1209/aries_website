"""Path-traced LEAP-One turntable frames with Blender Cycles (OptiX on the GPU).

    blender -b --python scripts/render-leap-one-turntable.py -- --version=v6
    blender -b --python scripts/render-leap-one-turntable.py -- --preview
    blender -b --python scripts/render-leap-one-turntable.py -- --version=v6 --start=0 --end=359 --resume

Frames are written as PNG to the operating system's temporary directory
(``aries-turntable-<version>`` or ``aries-turntable-preview``); run
``node scripts/encode-leap-one-turntable.mjs <that dir> --version=<version>`` afterwards to produce
the WebP sequence the site streams.

The scene is lit by the page itself: an environment built from the section's near-black ground, its
warm glow on the left, its cool glow on the right and its faint grid, plus a small studio rig that
follows the same warm-left / cool-right split. The floor fades into the page colour and the frames are
rendered with a transparent film so the encoder can composite them onto that colour exactly.
"""

import argparse
import math
import os
import re
import sys
import tempfile
import time

import bpy
import numpy as np
from mathutils import Matrix, Vector

FRAMES = 720
WIDTH, HEIGHT = 2400, 1800
PAGE_COLOR_SRGB = (3, 5, 6)


def srgb_to_linear(rgb):
    out = []
    for channel in rgb:
        value = channel / 255
        out.append(value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4)
    return tuple(out)


def hex_color(value):
    return srgb_to_linear(((value >> 16) & 255, (value >> 8) & 255, value & 255))


def parse_args():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument('--version', default='v6')
    parser.add_argument('--model', default=None)
    parser.add_argument('--preview', action='store_true')
    parser.add_argument('--samples', type=int, default=None)
    parser.add_argument('--frames', default=None, help='comma-separated frame numbers')
    parser.add_argument('--start', type=int, default=0)
    parser.add_argument('--end', type=int, default=FRAMES - 1)
    parser.add_argument('--resume', action='store_true', help='skip frames that already exist')
    parser.add_argument('--scale', type=float, default=1.0, help='resolution scale, e.g. 0.5 for quick previews')
    parser.add_argument('--without', default='', help='comma-separated object names to remove, for lighting diagnostics')
    return parser.parse_args(argv)


def three_to_blender(x, y, z):
    """The previous WebGL rig was authored Y-up; Blender is Z-up."""
    return Vector((x, -z, y))


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def mesh_world_vertices(obj):
    count = len(obj.data.vertices)
    if count == 0:
        return np.empty((0, 3))
    coords = np.empty(count * 3)
    obj.data.vertices.foreach_get('co', coords)
    coords = coords.reshape(-1, 3)
    matrix = np.array(obj.matrix_world)
    return coords @ matrix[:3, :3].T + matrix[:3, 3]


def world_bounds(objects):
    low = np.full(3, np.inf)
    high = np.full(3, -np.inf)
    for obj in objects:
        if obj.type != 'MESH':
            continue
        vertices = mesh_world_vertices(obj)
        if len(vertices):
            low = np.minimum(low, vertices.min(axis=0))
            high = np.maximum(high, vertices.max(axis=0))
    return low, high


def tyre_contacts(objects):
    contacts = []
    for obj in objects:
        if obj.type != 'MESH' or not any(token in obj.name.lower() for token in ('tire', 'tyre')):
            continue
        vertices = mesh_world_vertices(obj)
        if not len(vertices):
            continue
        centre = (vertices.min(axis=0) + vertices.max(axis=0)) / 2
        contacts.append((obj.name, centre[0], centre[1], vertices[:, 2].min()))
    if not contacts:
        return []
    lowest = min(contact[3] for contact in contacts)
    # Only tyres that reach the ground count; the name pattern can also match parts higher up.
    return [contact for contact in contacts if contact[3] < lowest + 0.2]


def emission_material(name, color, strength, radial=False):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value = (*color, 1)
    emission.inputs['Strength'].default_value = strength
    links.new(emission.outputs['Emission'], output.inputs['Surface'])
    if radial:
        # Soft radial falloff across the panel, like the page's radial-gradient glows.
        coordinates = nodes.new('ShaderNodeTexCoord')
        gradient = nodes.new('ShaderNodeTexGradient')
        gradient.gradient_type = 'SPHERICAL'
        ramp = nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].position = 0.0
        ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
        ramp.color_ramp.elements[1].position = 1.0
        ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
        middle = ramp.color_ramp.elements.new(0.45)
        middle.color = (0.35, 0.35, 0.35, 1)
        multiply = nodes.new('ShaderNodeMath')
        multiply.operation = 'MULTIPLY'
        multiply.inputs[1].default_value = strength
        links.new(coordinates.outputs['Object'], gradient.inputs['Vector'])
        links.new(gradient.outputs['Fac'], ramp.inputs['Fac'])
        links.new(ramp.outputs['Color'], multiply.inputs[0])
        links.new(multiply.outputs['Value'], emission.inputs['Strength'])
    return material


def grid_material(name, strength):
    """The section's 72 px grid, faded out towards both sides like the page does."""
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value = (1, 1, 1, 1)
    coordinates = nodes.new('ShaderNodeTexCoord')
    separate = nodes.new('ShaderNodeSeparateXYZ')
    links.new(coordinates.outputs['Object'], separate.inputs['Vector'])

    def line_mask(axis_output):
        scale = nodes.new('ShaderNodeMath')
        scale.operation = 'MULTIPLY'
        scale.inputs[1].default_value = 10
        fraction = nodes.new('ShaderNodeMath')
        fraction.operation = 'FRACT'
        threshold = nodes.new('ShaderNodeMath')
        threshold.operation = 'LESS_THAN'
        threshold.inputs[1].default_value = 0.012
        links.new(axis_output, scale.inputs[0])
        links.new(scale.outputs['Value'], fraction.inputs[0])
        links.new(fraction.outputs['Value'], threshold.inputs[0])
        return threshold.outputs['Value']

    lines = nodes.new('ShaderNodeMath')
    lines.operation = 'MAXIMUM'
    links.new(line_mask(separate.outputs['X']), lines.inputs[0])
    links.new(line_mask(separate.outputs['Y']), lines.inputs[1])
    # Fade towards the left and right edges (object X runs -1..1 across the panel).
    absolute = nodes.new('ShaderNodeMath')
    absolute.operation = 'ABSOLUTE'
    fade = nodes.new('ShaderNodeMapRange')
    fade.inputs['From Min'].default_value = 0.76
    fade.inputs['From Max'].default_value = 1.0
    fade.inputs['To Min'].default_value = 1.0
    fade.inputs['To Max'].default_value = 0.0
    links.new(separate.outputs['X'], absolute.inputs[0])
    links.new(absolute.outputs['Value'], fade.inputs['Value'])
    combine = nodes.new('ShaderNodeMath')
    combine.operation = 'MULTIPLY'
    links.new(lines.outputs['Value'], combine.inputs[0])
    links.new(fade.outputs['Result'], combine.inputs[1])
    scaled = nodes.new('ShaderNodeMath')
    scaled.operation = 'MULTIPLY'
    scaled.inputs[1].default_value = strength
    links.new(combine.outputs['Value'], scaled.inputs[0])
    links.new(scaled.outputs['Value'], emission.inputs['Strength'])
    links.new(emission.outputs['Emission'], output.inputs['Surface'])
    return material


def add_panel(name, size, location, target, material, visible_to_camera=False):
    bpy.ops.mesh.primitive_plane_add(size=2, location=location)
    panel = bpy.context.active_object
    panel.name = name
    panel.scale = (size / 2, size / 2, 1)
    look_at(panel, target)
    # A plane faces +Z locally; look_at points -Z at the target, so flip it round.
    panel.rotation_euler.rotate_axis('X', math.pi)
    panel.data.materials.append(material)
    panel.visible_camera = visible_to_camera
    panel.visible_shadow = False
    return panel


def add_area_light(name, color, power, size_x, size_y, location, target, spread=75):
    light_data = bpy.data.lights.new(name, 'AREA')
    light_data.shape = 'RECTANGLE'
    light_data.spread = math.radians(spread)
    light_data.size = size_x
    light_data.size_y = size_y
    light_data.color = color
    light_data.energy = power
    light = bpy.data.objects.new(name, light_data)
    bpy.context.collection.objects.link(light)
    light.location = location
    look_at(light, target)
    return light


def build_scene(args):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = args.model or os.path.join(root, 'public', 'media', 'models', 'leap-one.glb')

    # --- rover ---------------------------------------------------------------------------------
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=model_path)
    imported = [obj for obj in bpy.data.objects if obj not in before]
    roots = [obj for obj in imported if obj.parent is None]
    rover = bpy.data.objects.new('Rover', None)
    scene.collection.objects.link(rover)
    for obj in roots:
        obj.parent = rover
    bpy.context.view_layer.update()

    meshes = [obj for obj in imported if obj.type == 'MESH']
    # The CAD tessellation is coarse on cylinders, springs and tyres; smooth shading across edges below
    # 35 degrees keeps the hard chamfers while removing the faceting.
    bpy.ops.object.select_all(action='DESELECT')
    for obj in meshes:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35))
    bpy.ops.object.select_all(action='DESELECT')
    low, high = world_bounds(meshes)
    size = high - low
    rover.scale = (3.1 / size.max(),) * 3
    bpy.context.view_layer.update()

    # Stand the rover on its tyres. The CAD assembly leaves the suspension slightly articulated, so
    # fit a plane through the tyre contact points, tilt the body onto it and put the floor at the tyres.
    contacts = tyre_contacts(meshes)
    if len(contacts) >= 3:
        xs = np.array([c[1] for c in contacts])
        ys = np.array([c[2] for c in contacts])
        zs = np.array([c[3] for c in contacts])
        design = np.column_stack([xs, ys, np.ones_like(xs)])
        a, b, _ = np.linalg.lstsq(design, zs, rcond=None)[0]
        normal = Vector((-a, -b, 1.0)).normalized()
        tilt = math.degrees(math.acos(min(1.0, normal.z)))
        if tilt < 6:
            rover.rotation_mode = 'QUATERNION'
            rover.rotation_quaternion = normal.rotation_difference(Vector((0, 0, 1))) @ rover.rotation_quaternion
            bpy.context.view_layer.update()
        print(f'[diag] tyre plane tilt {tilt:.2f} deg' + (', body levelled' if tilt < 6 else ', left as is'))

    low, high = world_bounds(meshes)
    size = high - low
    centre = (low + high) / 2
    contacts = tyre_contacts(meshes)
    heights = sorted(c[3] for c in contacts)
    floor_z = heights[len(heights) // 2] if heights else low[2]
    print('[diag] tyre contact heights after levelling: ' + ' '.join(f'{h - floor_z:.4f}' for h in heights) + f' (lowest vertex {low[2] - floor_z:.4f})')
    rover.location = rover.location - Vector((centre[0], centre[1], floor_z))
    bpy.context.view_layer.update()
    height = float(size[2])

    turntable = bpy.data.objects.new('Turntable', None)
    scene.collection.objects.link(turntable)
    rover.parent = turntable
    # A collection of just the rover parts, so accent lights can be linked to the rover alone.
    rover_parts = bpy.data.collections.new('RoverParts')
    scene.collection.children.link(rover_parts)
    for obj in imported:
        rover_parts.objects.link(obj)

    # --- materials -----------------------------------------------------------------------------
    # The lossless export carries curated PBR materials (alu_extrusion, steel_bright, pla_orange,
    # acrylic_clear ...) which are kept as authored. Only the exporter's unnamed "r_g_b_..." fallback
    # materials get a plausible finish, and the clear acrylic becomes real glass.
    for material in bpy.data.materials:
        if not material.use_nodes:
            continue
        principled = next((node for node in material.node_tree.nodes if node.type == 'BSDF_PRINCIPLED'), None)
        if principled is None:
            continue
        if material.name.startswith('lamp_'):
            # Signal tower lenses: translucent glossy polycarbonate rather than opaque paint. The green
            # segment is lit (rover ready); red and amber are unlit, darker lenses.
            r, g, bch, _ = principled.inputs['Base Color'].default_value
            lit = material.name.endswith('green')
            tint = (r, g, bch)
            principled.inputs['Base Color'].default_value = (*(c * (0.9 if lit else 0.45) for c in tint), 1)
            principled.inputs['Transmission Weight'].default_value = 0.6
            principled.inputs['IOR'].default_value = 1.46
            principled.inputs['Roughness'].default_value = 0.12
            principled.inputs['Specular IOR Level'].default_value = 0.6
            principled.inputs['Metallic'].default_value = 0.0
            if lit:
                principled.inputs['Emission Color'].default_value = (r * 0.8, g, bch * 0.6, 1)
                principled.inputs['Emission Strength'].default_value = 2.5
            continue
        if material.name.startswith('cable_coiled'):
            # The drill's coiled cable: the site orange with a rubber-jacket sheen, not the export's dark red.
            principled.inputs['Base Color'].default_value = (*hex_color(0xff5a1f), 1)
            principled.inputs['Roughness'].default_value = 0.38
            principled.inputs['Specular IOR Level'].default_value = 0.6
            principled.inputs['Coat Weight'].default_value = 0.3
            continue
        if material.name.startswith('acrylic'):
            principled.inputs['Transmission Weight'].default_value = 1.0
            principled.inputs['IOR'].default_value = 1.49
            principled.inputs['Roughness'].default_value = 0.04
            principled.inputs['Base Color'].default_value = (0.92, 0.95, 0.97, 1)
            principled.inputs['Alpha'].default_value = 1.0
            continue
        if not re.match(r'^[0-9.]+_[0-9.]+_[0-9.]+', material.name):
            continue
        base = principled.inputs['Base Color']
        principled.inputs['Roughness'].default_value = max(principled.inputs['Roughness'].default_value, 0.34)
        if base.is_linked:
            continue
        r, g, b, _ = base.default_value
        maximum, minimum = max(r, g, b), min(r, g, b)
        lightness = (maximum + minimum) / 2
        saturation = 0 if maximum == minimum else (maximum - minimum) / (1 - abs(2 * lightness - 1) + 1e-6)
        if lightness < 0.03:
            # Rubber and black plastics keep a soft sheen rather than a dead matte.
            principled.inputs['Roughness'].default_value = 0.55
        elif saturation < 0.2 and lightness < 0.6:
            # Mid greys without a name are usually bare metal brackets.
            principled.inputs['Metallic'].default_value = max(principled.inputs['Metallic'].default_value, 0.7)
            principled.inputs['Roughness'].default_value = 0.35

    # --- environment: the page itself --------------------------------------------------------
    world = bpy.data.worlds.new('Page')
    scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes['Background']
    background.inputs['Color'].default_value = (*hex_color(0x0a0d10), 1)
    background.inputs['Strength'].default_value = 1.0

    aim = (0, 0, height * 0.45)
    # Page glows: rgba(255,90,31,.1) upper left and rgba(47,91,119,.13) lower right.
    add_panel('GlowWarm', 36, three_to_blender(-38, 14, 8), (0, 0, 0), emission_material('GlowWarm', hex_color(0xff5a1f), 0.16, radial=True))
    add_panel('GlowCool', 40, three_to_blender(40, 2, 4), (0, 0, 0), emission_material('GlowCool', hex_color(0x2f5b77), 0.22, radial=True))
    # The screen's own brightness above the section, and a faint sheet on the viewer's side.
    add_panel('SheetTop', 56, three_to_blender(4, 50, 10), (0, 0, 0), emission_material('SheetTop', hex_color(0xdfe6ec), 0.5, radial=True))
    add_panel('SheetFront', 52, three_to_blender(8, 10, 46), (0, 0, 0), emission_material('SheetFront', hex_color(0xcfd6dc), 0.22, radial=True))
    grid = grid_material('Grid', 1.2)
    add_panel('GridBack', 90, three_to_blender(0, 12, -34), (0, 12, 0), grid)
    add_panel('GridFront', 90, three_to_blender(0, 12, 34), (0, 12, 0), grid)

    # --- studio rig: same warm-left / cool-right split as the page ------------------------------
    add_area_light('Key', hex_color(0xf3f5f8), 820, 6, 4.5, three_to_blender(1.5, 6.5, 4.5), aim, spread=95)
    add_area_light('FillCool', hex_color(0x9fc0dc), 320, 3, 5, three_to_blender(6, 2.6, 1.5), aim, spread=70)
    add_area_light('FillFront', hex_color(0xe9eef3), 240, 5, 4, three_to_blender(4.5, 3.8, 6.5), (0, 0, height * 0.4), spread=70)
    # The warm rim is a backlight; on the floor it would read as a big orange sheen towards the camera,
    # so it is linked to the rover only and the floor never sees it.
    rim = add_area_light('RimWarm', hex_color(0xff5a1f), 260, 2, 4.5, three_to_blender(-4.5, 4.2, -3.6), (0, 0, height * 0.55), spread=70)
    rim.light_linking.receiver_collection = rover_parts
    sun_data = bpy.data.lights.new('Sun', 'SUN')
    sun_data.energy = 2.2
    sun_data.color = hex_color(0xf6f4ef)
    sun_data.angle = math.radians(3)
    sun = bpy.data.objects.new('Sun', sun_data)
    scene.collection.objects.link(sun)
    sun.location = three_to_blender(-2.6, 7.5, 5)
    look_at(sun, (0, 0, 1))

    # --- floor and ring --------------------------------------------------------------------------
    bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -0.008))
    floor = bpy.context.active_object
    floor.name = 'Floor'
    floor_material = bpy.data.materials.new('Floor')
    floor_material.use_nodes = True
    nodes = floor_material.node_tree.nodes
    links = floor_material.node_tree.links
    principled = nodes['Principled BSDF']
    # A polished dark floor: light enough for the shadows to read, glossy enough to carry a soft
    # reflection of the rover, still dark enough to dissolve into the page.
    principled.inputs['Base Color'].default_value = (*hex_color(0x0c1014), 1)
    principled.inputs['Roughness'].default_value = 0.26
    principled.inputs['Metallic'].default_value = 0.0
    principled.inputs['Specular IOR Level'].default_value = 0.6
    # Beyond the rover the floor dissolves into the page colour (transparent film, composited later).
    geometry = nodes.new('ShaderNodeNewGeometry')
    separate = nodes.new('ShaderNodeSeparateXYZ')
    distance = nodes.new('ShaderNodeVectorMath')
    distance.operation = 'LENGTH'
    fade = nodes.new('ShaderNodeMapRange')
    fade.inputs['From Min'].default_value = 3.2
    fade.inputs['From Max'].default_value = 9.0
    fade.inputs['To Min'].default_value = 0.0
    fade.inputs['To Max'].default_value = 1.0
    transparent = nodes.new('ShaderNodeBsdfTransparent')
    mix = nodes.new('ShaderNodeMixShader')
    output = nodes['Material Output']
    links.new(geometry.outputs['Position'], distance.inputs[0])
    links.new(distance.outputs['Value'], fade.inputs['Value'])
    links.new(fade.outputs['Result'], mix.inputs['Fac'])
    links.new(principled.outputs['BSDF'], mix.inputs[1])
    links.new(transparent.outputs['BSDF'], mix.inputs[2])
    links.new(mix.outputs['Shader'], output.inputs['Surface'])
    floor.data.materials.append(floor_material)

    bpy.ops.mesh.primitive_circle_add(vertices=240, radius=2.024, fill_type='NOTHING', location=(0, 0, -0.005))
    ring = bpy.context.active_object
    ring.name = 'Ring'
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.extrude_region_move(TRANSFORM_OT_translate={'value': (0, 0, 0)})
    bpy.ops.transform.resize(value=(1.004, 1.004, 1))
    bpy.ops.object.mode_set(mode='OBJECT')
    ring.data.materials.append(emission_material('Ring', hex_color(0xff5a1f), 2.4))
    ring.visible_shadow = False

    # --- camera ------------------------------------------------------------------------------------
    camera_data = bpy.data.cameras.new('Camera')
    camera_data.type = 'ORTHO'
    camera_data.ortho_scale = 5.0
    camera_data.clip_end = 200
    camera = bpy.data.objects.new('Camera', camera_data)
    scene.collection.objects.link(camera)
    camera.location = three_to_blender(4.4, 3.05, 5.35)
    look_at(camera, (0, 0, height * 0.48))
    scene.camera = camera

    # --- render settings ---------------------------------------------------------------------------
    scene.render.engine = 'CYCLES'
    preferences = bpy.context.preferences.addons['cycles'].preferences
    device_type = 'NONE'
    for candidate in ('OPTIX', 'CUDA'):
        try:
            preferences.compute_device_type = candidate
            preferences.get_devices()
            if any(device.type == candidate for device in preferences.devices):
                device_type = candidate
                break
        except Exception:  # noqa: BLE001 - the backend simply is not available
            continue
    for device in preferences.devices:
        device.use = device.type == device_type
    scene.cycles.device = 'GPU' if device_type != 'NONE' else 'CPU'
    print(f'[diag] cycles device {device_type}: ' + ', '.join(f'{device.name}({device.type}, {"on" if device.use else "off"})' for device in preferences.devices))

    scene.cycles.samples = args.samples or (48 if args.preview else 96)
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.02
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = 'OPTIX' if device_type == 'OPTIX' else 'OPENIMAGEDENOISE'
    scene.cycles.denoising_use_gpu = True
    scene.cycles.max_bounces = 10
    scene.cycles.glossy_bounces = 5
    scene.cycles.transparent_max_bounces = 12
    scene.cycles.caustics_reflective = False
    scene.cycles.caustics_refractive = False
    scene.cycles.blur_glossy = 0.6
    scene.render.use_persistent_data = True
    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = HEIGHT
    scene.render.resolution_percentage = int(args.scale * 100)
    scene.render.film_transparent = True
    scene.render.filter_size = 1.4
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'
    scene.render.image_settings.compression = 40
    # PBR Neutral keeps the CAD colours (the anodised orange in particular) instead of desaturating them.
    scene.view_settings.view_transform = 'Khronos PBR Neutral'
    scene.view_settings.look = 'None'
    scene.view_settings.exposure = -0.85
    scene.view_settings.gamma = 1.0
    return turntable


def main():
    args = parse_args()
    output_dir = os.path.join(tempfile.gettempdir(), 'aries-turntable-preview' if args.preview else f'aries-turntable-{args.version}')
    os.makedirs(output_dir, exist_ok=True)
    turntable = build_scene(args)
    scene = bpy.context.scene
    for name in filter(None, args.without.split(',')):
        if name in bpy.data.objects:
            bpy.data.objects.remove(bpy.data.objects[name])

    if args.frames:
        selected = [int(value) for value in args.frames.split(',')]
    elif args.preview:
        selected = [0, 90, 180, 270, 360, 540]
    else:
        selected = list(range(args.start, args.end + 1))

    started = time.time()
    rendered = 0
    for frame in selected:
        path = os.path.join(output_dir, f'frame_{frame:03d}.png')
        if args.resume and os.path.exists(path):
            continue
        turntable.rotation_euler = (0, 0, -(frame / FRAMES) * math.tau + math.pi * 0.13)
        scene.render.filepath = path
        frame_started = time.time()
        bpy.ops.render.render(write_still=True)
        rendered += 1
        elapsed = time.time() - started
        remaining = (len(selected) - selected.index(frame) - 1) * (elapsed / rendered)
        print(f'Rendered frame {frame}/{FRAMES} in {time.time() - frame_started:.1f} s ({elapsed:.0f} s elapsed, ~{remaining / 60:.0f} min left)', flush=True)
    print(f'Rendered {rendered} frames to {output_dir}', flush=True)


main()
