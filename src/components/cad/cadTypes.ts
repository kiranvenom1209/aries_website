export type CadView = 'iso' | 'front' | 'side' | 'top'
export type CadRenderMode = 'solid' | 'xray' | 'blueprint'

export type CadStats = {
  parts: number
  triangles: number
}

export const CAD_MODEL_URL = '/media/models/leap-one-web.glb'
export const CAD_MODEL_BYTES = 8_815_512

/**
 * Onshape part names carry configuration and file noise ("Lidar Mount(Default)Display State 1",
 * "XT60E_F.step(…)"). Keep the readable part: cut the configuration, file extension and author
 * suffixes ("tire.Vighnesh right" → "Tire right"), and normalise separators.
 */
export function cleanPartName(raw: string): string {
  const name = raw
    .replace(/\(.*$/, '')
    .replace(/\.(step|stp|sldprt)$/i, '')
    .replace(/^(\w+)\.[A-Z][a-z]+\b/, '$1')
    .replace(/[_^]+/g, ' ')
    .replace(/\s+-\s*\d+$/, '')
    .replace(/\s+/g, ' ')
    .trim()
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Unnamed part'
}
