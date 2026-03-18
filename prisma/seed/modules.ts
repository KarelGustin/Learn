async function seedModules(prisma: any) {
  const modules = [
    // ─── PYTHON FUNDAMENTALS ─────────────────────────────
    {
      id: 'mod_python_basics',
      trackId: 'trk_python_fundamentals',
      name: 'Python Basics',
      slug: 'python-basics',
      description: 'Variables, data types, operators, and your first Python programs. The foundation for all robotics software.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 8,
    },
    {
      id: 'mod_python_control_flow',
      trackId: 'trk_python_fundamentals',
      name: 'Control Flow & Functions',
      slug: 'python-control-flow',
      description: 'Conditionals, loops, functions, and error handling. Write structured programs that can make decisions.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 2,
      estimatedHours: 10,
    },
    {
      id: 'mod_python_data',
      trackId: 'trk_python_fundamentals',
      name: 'Data Structures in Python',
      slug: 'python-data-structures',
      description: 'Lists, dictionaries, sets, tuples, and comprehensions. Organize and manipulate data efficiently.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 3,
      estimatedHours: 10,
    },
    {
      id: 'mod_python_oop',
      trackId: 'trk_python_fundamentals',
      name: 'Object-Oriented Python',
      slug: 'python-oop',
      description: 'Classes, inheritance, polymorphism, and design patterns. Model real-world robotic components as objects.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 4,
      estimatedHours: 12,
    },

    // ─── CIRCUIT FUNDAMENTALS ────────────────────────────
    {
      id: 'mod_dc_circuits',
      trackId: 'trk_circuit_fundamentals',
      name: 'DC Circuit Analysis',
      slug: 'dc-circuit-analysis',
      description: 'Voltage, current, resistance, Ohm\'s law, and Kirchhoff\'s laws. Analyze the circuits that power every robot.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 8,
    },
    {
      id: 'mod_components',
      trackId: 'trk_circuit_fundamentals',
      name: 'Electronic Components',
      slug: 'electronic-components',
      description: 'Resistors, capacitors, inductors, diodes, and transistors. Understand the building blocks of robot electronics.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 2,
      estimatedHours: 10,
    },

    // ─── ENGINEERING MECHANICS ───────────────────────────
    {
      id: 'mod_statics',
      trackId: 'trk_mechanics_fundamentals',
      name: 'Statics & Forces',
      slug: 'statics-forces',
      description: 'Force vectors, equilibrium, free body diagrams, and moment analysis. Understand how robots support loads.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 10,
    },
    {
      id: 'mod_dynamics',
      trackId: 'trk_mechanics_fundamentals',
      name: 'Dynamics & Motion',
      slug: 'dynamics-motion',
      description: 'Kinematics, Newton\'s laws, energy methods, and momentum. Analyze how robots move through space.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 2,
      estimatedHours: 12,
    },

    // ─── MATH FOR ML ────────────────────────────────────
    {
      id: 'mod_linear_algebra',
      trackId: 'trk_math_foundations',
      name: 'Linear Algebra Essentials',
      slug: 'linear-algebra-essentials',
      description: 'Vectors, matrices, transformations, eigenvalues, and SVD. The mathematical language of robotics and ML.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 12,
    },
    {
      id: 'mod_calculus_review',
      trackId: 'trk_math_foundations',
      name: 'Calculus for Robotics',
      slug: 'calculus-for-robotics',
      description: 'Derivatives, integrals, gradients, and optimization. Essential calculus concepts applied to robotics problems.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 2,
      estimatedHours: 10,
    },
    {
      id: 'mod_probability_stats',
      trackId: 'trk_math_foundations',
      name: 'Probability & Statistics',
      slug: 'probability-statistics',
      description: 'Probability distributions, Bayes\' theorem, estimation, and statistical testing for sensor fusion and ML.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 3,
      estimatedHours: 10,
    },

    // ─── CLASSICAL CONTROLS ─────────────────────────────
    {
      id: 'mod_intro_controls',
      trackId: 'trk_classical_controls',
      name: 'Introduction to Control Systems',
      slug: 'intro-control-systems',
      description: 'Feedback loops, system modeling, transfer functions, and block diagrams. The foundation of robot motion control.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 8,
    },
    {
      id: 'mod_pid_control',
      trackId: 'trk_classical_controls',
      name: 'PID Control',
      slug: 'pid-control',
      description: 'Proportional, integral, and derivative control. Tune PID controllers for motors, balance, and trajectory tracking.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 2,
      estimatedHours: 10,
    },

    // ─── ROS2 FUNDAMENTALS ──────────────────────────────
    {
      id: 'mod_ros2_intro',
      trackId: 'trk_ros2_fundamentals',
      name: 'Getting Started with ROS2',
      slug: 'ros2-getting-started',
      description: 'ROS2 installation, workspace setup, packages, nodes, and the publisher-subscriber communication pattern.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 8,
    },
    {
      id: 'mod_ros2_comms',
      trackId: 'trk_ros2_fundamentals',
      name: 'ROS2 Communication',
      slug: 'ros2-communication',
      description: 'Topics, services, actions, and parameters. Build modular robot systems with well-defined interfaces.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 2,
      estimatedHours: 10,
    },

    // ─── CAD & 3D PRINTING ──────────────────────────────
    {
      id: 'mod_cad_intro',
      trackId: 'trk_cad_design',
      name: 'Introduction to CAD',
      slug: 'intro-to-cad',
      description: 'Parametric modeling fundamentals, sketch constraints, extrusions, and assemblies using Fusion 360.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 10,
    },

    // ─── FOUNDER MINDSET ────────────────────────────────
    {
      id: 'mod_founder_intro',
      trackId: 'trk_founder_mindset',
      name: 'The Robotics Founder',
      slug: 'the-robotics-founder',
      description: 'Why robotics, why now, and why you. Develop your founder thesis and understand the robotics startup landscape.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 6,
    },

    // ─── GAZEBO & URDF ──────────────────────────────────
    {
      id: 'mod_sim_intro',
      trackId: 'trk_gazebo',
      name: 'Introduction to Robot Simulation',
      slug: 'intro-robot-simulation',
      description: 'Why simulate? Physics engines, URDF basics, and your first simulated robot in Gazebo.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 8,
    },

    // ─── C++ FOR ROBOTICS ───────────────────────────────
    {
      id: 'mod_cpp_basics',
      trackId: 'trk_cpp_fundamentals',
      name: 'C++ Basics',
      slug: 'cpp-basics',
      description: 'Variables, types, pointers, references, and memory management. The performance-critical language of robotics.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 10,
    },

    // ─── EMBEDDED SYSTEMS ───────────────────────────────
    {
      id: 'mod_microcontrollers',
      trackId: 'trk_embedded_systems',
      name: 'Microcontroller Fundamentals',
      slug: 'microcontroller-fundamentals',
      description: 'Arduino and STM32 basics: GPIO, analog I/O, timers, and interrupts for robot low-level control.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      estimatedHours: 10,
    },
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: mod,
      create: mod,
    });
  }

  console.log(`  ✓ Seeded ${modules.length} modules`);
}

module.exports = { seedModules };
