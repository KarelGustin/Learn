async function seedProjects(prisma: any) {
  const projects = [
    {
      id: 'proj_cli_calculator',
      moduleId: 'mod_python_basics',
      name: 'CLI Calculator & Unit Converter',
      slug: 'cli-calculator',
      description: 'Build a command-line calculator that handles arithmetic operations and converts between units commonly used in robotics (meters/feet, radians/degrees, RPM/rad/s).',
      difficulty: 'INTRODUCTORY',
      estimatedHours: 3,
      isCapstone: false,
      skillIds: 'skill_py_variables,skill_py_math,skill_py_control_flow,skill_py_functions',
      milestones: [
        { name: 'Basic arithmetic operations (+, -, *, /)', description: 'Accept two numbers and an operator, compute and display result' },
        { name: 'Input validation and error handling', description: 'Handle division by zero, invalid input gracefully' },
        { name: 'Unit conversion module', description: 'Convert between m/ft, rad/deg, RPM to rad/s' },
        { name: 'Command history and repeat', description: 'Store last 10 calculations, allow recall' },
      ],
    },
    {
      id: 'proj_sensor_logger',
      moduleId: 'mod_python_basics',
      name: 'Sensor Data Logger',
      slug: 'sensor-logger',
      description: 'Build a Python tool that reads simulated sensor data, logs it to CSV files with timestamps, computes running statistics, and detects anomalies.',
      difficulty: 'FOUNDATIONAL',
      estimatedHours: 5,
      isCapstone: false,
      skillIds: 'skill_py_functions,skill_py_data_structures,skill_py_file_io',
      milestones: [
        { name: 'Generate simulated sensor readings', description: 'Create functions that simulate temperature, distance, and IMU data with noise' },
        { name: 'CSV logging with timestamps', description: 'Write sensor data to CSV with ISO timestamps' },
        { name: 'Running statistics (mean, std, min, max)', description: 'Compute and display live statistics' },
        { name: 'Anomaly detection', description: 'Flag readings >2 standard deviations from mean' },
        { name: 'Data visualization output', description: 'Export summary plots or formatted report' },
      ],
    },
    {
      id: 'proj_circuit_analyzer',
      moduleId: 'mod_dc_circuits',
      name: 'Resistor Network Calculator',
      slug: 'circuit-analyzer',
      description: 'Build a tool that calculates total resistance, current, and voltage drops for series and parallel resistor networks. Reinforces circuit analysis skills.',
      difficulty: 'FOUNDATIONAL',
      estimatedHours: 4,
      isCapstone: false,
      skillIds: 'skill_ee_ohms_law,skill_ee_circuits,skill_py_functions',
      milestones: [
        { name: 'Series resistance calculator', description: 'Compute total resistance and current for series circuits' },
        { name: 'Parallel resistance calculator', description: 'Compute equivalent resistance for parallel networks' },
        { name: 'Voltage divider calculator', description: 'Calculate Vout for any R1, R2, Vin combination' },
        { name: 'Power budget calculator', description: 'Show power dissipation per component and total' },
      ],
    },
    {
      id: 'proj_2d_robot_sim',
      moduleId: 'mod_python_basics',
      name: '2D Robot Simulator',
      slug: '2d-robot-simulator',
      description: 'Create a simple 2D simulation of a differential-drive robot that can move forward, turn, and avoid walls. Uses basic physics and control.',
      difficulty: 'INTERMEDIATE',
      estimatedHours: 8,
      isCapstone: true,
      skillIds: 'skill_py_oop,skill_py_math,skill_math_vectors,skill_ctrl_pid',
      milestones: [
        { name: 'Robot class with position and heading', description: 'Define Robot with x, y, theta state and move/turn methods' },
        { name: 'Simulated environment with walls', description: 'Create a 2D grid world with obstacles' },
        { name: 'Distance sensor simulation', description: 'Simulate a range sensor that detects wall distance' },
        { name: 'Simple obstacle avoidance', description: 'Implement wall-following or reactive obstacle avoidance' },
        { name: 'Trajectory logging and replay', description: 'Record and visualize the robot path' },
      ],
    },
    {
      id: 'proj_motor_control',
      moduleId: 'mod_dc_circuits',
      name: 'Motor Speed Controller',
      slug: 'motor-speed-controller',
      description: 'Design a PWM-based motor speed controller using an Arduino/ESP32 and an H-bridge driver. Includes encoder feedback for closed-loop control.',
      difficulty: 'INTERMEDIATE',
      estimatedHours: 10,
      isCapstone: false,
      skillIds: 'skill_ee_motors,skill_ee_microcontroller,skill_ctrl_pid',
      milestones: [
        { name: 'Basic motor spinning with PWM', description: 'Drive a DC motor at variable speed using PWM' },
        { name: 'Direction control with H-bridge', description: 'Add forward/reverse using an L298N or similar' },
        { name: 'Encoder reading', description: 'Read encoder pulses and compute RPM' },
        { name: 'PID speed controller', description: 'Implement closed-loop PID to maintain target RPM' },
        { name: 'Serial command interface', description: 'Accept speed setpoints via serial from Python' },
      ],
    },
    {
      id: 'proj_pendulum_sim',
      moduleId: 'mod_python_basics',
      name: 'Pendulum Simulator',
      slug: 'pendulum-simulator',
      description: 'Simulate a simple and inverted pendulum using numerical integration. Apply PID control to balance the inverted pendulum. Foundation for controls.',
      difficulty: 'INTERMEDIATE',
      estimatedHours: 6,
      isCapstone: false,
      skillIds: 'skill_math_calculus,skill_sim_physics,skill_ctrl_pid,skill_py_oop',
      milestones: [
        { name: 'Simple pendulum dynamics', description: 'Implement the pendulum ODE: θ\'\' = -(g/L)sin(θ)' },
        { name: 'Euler integration', description: 'Simulate with timestep-based numerical integration' },
        { name: 'Energy analysis', description: 'Track and display kinetic + potential energy over time' },
        { name: 'Inverted pendulum with PID', description: 'Apply PID control to balance pendulum upright' },
      ],
    },
  ];

  for (const proj of projects) {
    const { milestones, ...projectData } = proj;
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: projectData,
      create: projectData,
    });

    for (let i = 0; i < milestones.length; i++) {
      const msId = `${proj.id}_ms_${i + 1}`;
      await prisma.projectMilestone.upsert({
        where: { id: msId },
        update: { ...milestones[i], sortOrder: i + 1, projectId: proj.id },
        create: { id: msId, ...milestones[i], sortOrder: i + 1, projectId: proj.id },
      });
    }
  }

  console.log(`  ✓ Seeded ${projects.length} projects with milestones`);
}

module.exports = { seedProjects };
