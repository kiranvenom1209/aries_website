/** LEAP-One's ERC 2026 configuration as published on /leap-one; the CAD viewer reads the same list. */
export const specGroups = [
  {
    code: '01',
    description: 'Load-bearing structure, terrain handling and motive force.',
    title: 'Mobility & structure',
    items: [
      { label: 'Chassis material', value: 'Aluminium 3.3535 (5754)' },
      { label: 'Suspension type', value: '6-Wheel Rocker-Bogie with Differential' },
      { label: 'Ground clearance', value: '180 mm nominal' },
      { label: 'Gradeability', value: '35° incline traverse · design target' },
      { label: 'Drivetrain', value: '6× Botwheel BLDC + ODrive S1' },
      { label: 'Wheel architecture', value: 'Custom 3D-Printed TPU Wheels' },
    ],
  },
  {
    code: '02',
    description: 'Energy storage, endurance and the compute core behind the mission.',
    title: 'Power & compute',
    items: [
      { label: 'Battery architecture', value: '4× 12.8 V, 30 Ah LiFePO₄ in 2S2P' },
      { label: 'Stored energy', value: '25.6 V · 60 Ah · ≈1.5 kWh' },
      { label: 'Estimated autonomy', value: '≈1 h 21 min at design load' },
      { label: 'Primary compute', value: 'ROG NUC 15 + Teensy 4.1' },
    ],
  },
  {
    code: '03',
    description: 'Autonomy, science instrumentation and mission communication links.',
    title: 'Mission systems',
    items: [
      { label: 'Autonomy framework', value: 'ROS 2 on Ubuntu 24.04 · EKF + DWA' },
      {
        label: 'Depth cameras',
        value: 'Multiple front RealSense cameras + wrist camera near gripper',
      },
      { label: 'Mast camera', value: 'Logitech camera' },
      { label: 'Manipulation system', value: 'Igus ReBeL 6-DoF · 2 kg payload' },
      { label: 'Sampling drill', value: '530 mm coaxial auger · ≥300 mm depth' },
      { label: 'Primary data link', value: '5 GHz AirMAX TDMA · 400 m verified' },
      { label: 'Backup link', value: '2.4 GHz ExpressLRS' },
    ],
  },
]
