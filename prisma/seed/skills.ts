async function seedSkills(prisma: any) {
  const skills = [
    // SOFTWARE
    { id: 'skill_py_variables', domainId: 'dom_software', name: 'Python Variables & Types', slug: 'py-variables-types', description: 'Create, assign, and use variables with proper typing in Python', category: 'Python' },
    { id: 'skill_py_math', domainId: 'dom_software', name: 'Python Arithmetic', slug: 'py-arithmetic', description: 'Perform numeric calculations and type conversions', category: 'Python' },
    { id: 'skill_py_control_flow', domainId: 'dom_software', name: 'Python Control Flow', slug: 'py-control-flow', description: 'Use conditionals and loops to control program execution', category: 'Python' },
    { id: 'skill_py_functions', domainId: 'dom_software', name: 'Python Functions', slug: 'py-functions', description: 'Define, call, and compose functions with parameters and return values', category: 'Python' },
    { id: 'skill_py_oop', domainId: 'dom_software', name: 'Python OOP', slug: 'py-oop', description: 'Design classes, inheritance, and object-oriented patterns', category: 'Python' },
    { id: 'skill_py_data_structures', domainId: 'dom_software', name: 'Python Data Structures', slug: 'py-data-structures', description: 'Use lists, dicts, sets, tuples effectively', category: 'Python' },
    { id: 'skill_py_file_io', domainId: 'dom_software', name: 'Python File I/O', slug: 'py-file-io', description: 'Read and write files, handle CSV and JSON data', category: 'Python' },
    { id: 'skill_linux_terminal', domainId: 'dom_software', name: 'Linux Terminal', slug: 'linux-terminal', description: 'Navigate filesystem, manage processes, use shell commands', category: 'Linux' },
    { id: 'skill_linux_scripting', domainId: 'dom_software', name: 'Shell Scripting', slug: 'shell-scripting', description: 'Write bash scripts for automation', category: 'Linux' },
    { id: 'skill_git_basics', domainId: 'dom_software', name: 'Git Basics', slug: 'git-basics', description: 'Init, add, commit, branch, merge — core version control', category: 'Git' },
    { id: 'skill_git_collaboration', domainId: 'dom_software', name: 'Git Collaboration', slug: 'git-collaboration', description: 'Push, pull, PRs, resolve conflicts', category: 'Git' },
    { id: 'skill_cpp_basics', domainId: 'dom_software', name: 'C++ Basics', slug: 'cpp-basics', description: 'Variables, control flow, functions in C++', category: 'C++' },
    { id: 'skill_cpp_memory', domainId: 'dom_software', name: 'C++ Memory Management', slug: 'cpp-memory', description: 'Pointers, references, RAII, smart pointers', category: 'C++' },
    { id: 'skill_ros_basics', domainId: 'dom_software', name: 'ROS2 Basics', slug: 'ros2-basics', description: 'Nodes, topics, services, actions in ROS2', category: 'ROS' },

    // ELECTRICAL
    { id: 'skill_ee_ohms_law', domainId: 'dom_electrical', name: "Ohm's Law", slug: 'ohms-law', description: 'Apply V=IR to calculate voltage, current, and resistance', category: 'Circuits' },
    { id: 'skill_ee_circuits', domainId: 'dom_electrical', name: 'Series & Parallel Circuits', slug: 'series-parallel', description: 'Analyze series and parallel resistor networks', category: 'Circuits' },
    { id: 'skill_ee_power', domainId: 'dom_electrical', name: 'Electrical Power', slug: 'electrical-power', description: 'Calculate power dissipation and energy consumption', category: 'Circuits' },
    { id: 'skill_ee_capacitors', domainId: 'dom_electrical', name: 'Capacitors', slug: 'capacitors', description: 'Understand capacitor behavior, RC circuits, filtering', category: 'Circuits' },
    { id: 'skill_ee_sensors', domainId: 'dom_electrical', name: 'Sensor Interfacing', slug: 'sensor-interfacing', description: 'Connect and read analog/digital sensors', category: 'Sensors' },
    { id: 'skill_ee_motors', domainId: 'dom_electrical', name: 'Motor Driving', slug: 'motor-driving', description: 'Drive DC motors, servos, and steppers with H-bridges and drivers', category: 'Actuators' },
    { id: 'skill_ee_microcontroller', domainId: 'dom_electrical', name: 'Microcontroller Basics', slug: 'microcontroller-basics', description: 'Program Arduino/ESP32 for GPIO, ADC, PWM', category: 'Embedded' },

    // MECHANICAL
    { id: 'skill_me_statics', domainId: 'dom_mechanical', name: 'Statics & Forces', slug: 'statics-forces', description: 'Analyze forces, moments, and equilibrium', category: 'Mechanics' },
    { id: 'skill_me_materials', domainId: 'dom_mechanical', name: 'Material Properties', slug: 'material-properties', description: 'Select materials based on strength, weight, cost', category: 'Materials' },
    { id: 'skill_me_cad', domainId: 'dom_mechanical', name: 'CAD Modeling', slug: 'cad-modeling', description: 'Create 3D models of robot parts and assemblies', category: 'Design' },
    { id: 'skill_me_mechanisms', domainId: 'dom_mechanical', name: 'Mechanisms & Linkages', slug: 'mechanisms-linkages', description: 'Design gear trains, linkages, and transmissions', category: 'Mechanisms' },

    // MATH / ML
    { id: 'skill_math_vectors', domainId: 'dom_ml', name: 'Vectors & Matrices', slug: 'vectors-matrices', description: 'Vector operations, matrix multiplication, transformations', category: 'Linear Algebra' },
    { id: 'skill_math_calculus', domainId: 'dom_ml', name: 'Calculus Basics', slug: 'calculus-basics', description: 'Derivatives, integrals, gradients for optimization', category: 'Calculus' },
    { id: 'skill_ml_regression', domainId: 'dom_ml', name: 'Linear Regression', slug: 'linear-regression', description: 'Fit linear models, understand loss functions', category: 'Classical ML' },
    { id: 'skill_ml_classification', domainId: 'dom_ml', name: 'Classification', slug: 'classification', description: 'Binary and multi-class classification algorithms', category: 'Classical ML' },
    { id: 'skill_ml_neural_nets', domainId: 'dom_ml', name: 'Neural Networks', slug: 'neural-networks', description: 'Build and train feedforward neural networks', category: 'Deep Learning' },
    { id: 'skill_cv_basics', domainId: 'dom_ml', name: 'Computer Vision Basics', slug: 'cv-basics', description: 'Image processing, feature detection, object recognition', category: 'Computer Vision' },

    // RL
    { id: 'skill_rl_mdps', domainId: 'dom_rl', name: 'MDPs & Bellman Equations', slug: 'mdps-bellman', description: 'Model decision problems as Markov Decision Processes', category: 'Foundations' },
    { id: 'skill_rl_q_learning', domainId: 'dom_rl', name: 'Q-Learning', slug: 'q-learning', description: 'Implement tabular Q-learning for discrete problems', category: 'Value Methods' },
    { id: 'skill_rl_policy_gradient', domainId: 'dom_rl', name: 'Policy Gradients', slug: 'policy-gradients', description: 'Train policies using REINFORCE and actor-critic methods', category: 'Policy Methods' },

    // ROBOTICS
    { id: 'skill_rob_kinematics', domainId: 'dom_robotics', name: 'Forward Kinematics', slug: 'forward-kinematics', description: 'Compute end-effector position from joint angles', category: 'Kinematics' },
    { id: 'skill_rob_inverse_kin', domainId: 'dom_robotics', name: 'Inverse Kinematics', slug: 'inverse-kinematics', description: 'Compute joint angles to reach a target position', category: 'Kinematics' },
    { id: 'skill_rob_motion_planning', domainId: 'dom_robotics', name: 'Motion Planning', slug: 'motion-planning', description: 'Plan collision-free paths using RRT, A*, and sampling methods', category: 'Planning' },
    { id: 'skill_rob_slam', domainId: 'dom_robotics', name: 'SLAM', slug: 'slam', description: 'Simultaneous Localization and Mapping for mobile robots', category: 'Perception' },

    // CONTROLS
    { id: 'skill_ctrl_pid', domainId: 'dom_controls', name: 'PID Control', slug: 'pid-control', description: 'Design and tune PID controllers for position and velocity', category: 'Classical Control' },
    { id: 'skill_ctrl_state_space', domainId: 'dom_controls', name: 'State-Space Control', slug: 'state-space', description: 'Model systems with state vectors and design state feedback', category: 'Modern Control' },
    { id: 'skill_ctrl_stability', domainId: 'dom_controls', name: 'Stability Analysis', slug: 'stability-analysis', description: 'Analyze system stability using poles, Bode, and Nyquist', category: 'Analysis' },

    // SIMULATION
    { id: 'skill_sim_physics', domainId: 'dom_simulation', name: 'Physics Simulation', slug: 'physics-simulation', description: 'Simulate rigid body dynamics, collisions, gravity', category: 'Basics' },
    { id: 'skill_sim_gazebo', domainId: 'dom_simulation', name: 'Gazebo Simulation', slug: 'gazebo', description: 'Build and run robot simulations in Gazebo', category: 'Tools' },

    // FOUNDER
    { id: 'skill_founder_product', domainId: 'dom_founder', name: 'Product Thinking', slug: 'product-thinking', description: 'Identify problems, define MVPs, validate assumptions', category: 'Product' },
    { id: 'skill_founder_market', domainId: 'dom_founder', name: 'Market Analysis', slug: 'market-analysis', description: 'Analyze robotics markets, competition, and opportunities', category: 'Business' },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: skill,
      create: skill,
    });
  }

  // Skill dependencies
  const dependencies = [
    { id: 'dep_1', dependentId: 'skill_py_control_flow', prerequisiteId: 'skill_py_variables', minMasteryLevel: 2 },
    { id: 'dep_2', dependentId: 'skill_py_functions', prerequisiteId: 'skill_py_control_flow', minMasteryLevel: 2 },
    { id: 'dep_3', dependentId: 'skill_py_oop', prerequisiteId: 'skill_py_functions', minMasteryLevel: 3 },
    { id: 'dep_4', dependentId: 'skill_py_data_structures', prerequisiteId: 'skill_py_variables', minMasteryLevel: 2 },
    { id: 'dep_5', dependentId: 'skill_py_file_io', prerequisiteId: 'skill_py_functions', minMasteryLevel: 2 },
    { id: 'dep_6', dependentId: 'skill_linux_scripting', prerequisiteId: 'skill_linux_terminal', minMasteryLevel: 2 },
    { id: 'dep_7', dependentId: 'skill_git_collaboration', prerequisiteId: 'skill_git_basics', minMasteryLevel: 3 },
    { id: 'dep_8', dependentId: 'skill_cpp_memory', prerequisiteId: 'skill_cpp_basics', minMasteryLevel: 3 },
    { id: 'dep_9', dependentId: 'skill_ros_basics', prerequisiteId: 'skill_py_oop', minMasteryLevel: 2 },
    { id: 'dep_10', dependentId: 'skill_ros_basics', prerequisiteId: 'skill_linux_terminal', minMasteryLevel: 2 },
    { id: 'dep_11', dependentId: 'skill_ee_circuits', prerequisiteId: 'skill_ee_ohms_law', minMasteryLevel: 2 },
    { id: 'dep_12', dependentId: 'skill_ee_power', prerequisiteId: 'skill_ee_ohms_law', minMasteryLevel: 2 },
    { id: 'dep_13', dependentId: 'skill_ee_capacitors', prerequisiteId: 'skill_ee_circuits', minMasteryLevel: 2 },
    { id: 'dep_14', dependentId: 'skill_ee_sensors', prerequisiteId: 'skill_ee_circuits', minMasteryLevel: 2 },
    { id: 'dep_15', dependentId: 'skill_ee_motors', prerequisiteId: 'skill_ee_power', minMasteryLevel: 2 },
    { id: 'dep_16', dependentId: 'skill_ee_microcontroller', prerequisiteId: 'skill_ee_circuits', minMasteryLevel: 2 },
    { id: 'dep_17', dependentId: 'skill_ml_regression', prerequisiteId: 'skill_math_vectors', minMasteryLevel: 2 },
    { id: 'dep_18', dependentId: 'skill_ml_regression', prerequisiteId: 'skill_math_calculus', minMasteryLevel: 2 },
    { id: 'dep_19', dependentId: 'skill_ml_classification', prerequisiteId: 'skill_ml_regression', minMasteryLevel: 2 },
    { id: 'dep_20', dependentId: 'skill_ml_neural_nets', prerequisiteId: 'skill_ml_classification', minMasteryLevel: 3 },
    { id: 'dep_21', dependentId: 'skill_cv_basics', prerequisiteId: 'skill_ml_neural_nets', minMasteryLevel: 2 },
    { id: 'dep_22', dependentId: 'skill_rl_q_learning', prerequisiteId: 'skill_rl_mdps', minMasteryLevel: 2 },
    { id: 'dep_23', dependentId: 'skill_rl_policy_gradient', prerequisiteId: 'skill_rl_q_learning', minMasteryLevel: 3 },
    { id: 'dep_24', dependentId: 'skill_rob_inverse_kin', prerequisiteId: 'skill_rob_kinematics', minMasteryLevel: 3 },
    { id: 'dep_25', dependentId: 'skill_rob_kinematics', prerequisiteId: 'skill_math_vectors', minMasteryLevel: 3 },
    { id: 'dep_26', dependentId: 'skill_rob_motion_planning', prerequisiteId: 'skill_rob_kinematics', minMasteryLevel: 2 },
    { id: 'dep_27', dependentId: 'skill_ctrl_state_space', prerequisiteId: 'skill_ctrl_pid', minMasteryLevel: 3 },
    { id: 'dep_28', dependentId: 'skill_ctrl_stability', prerequisiteId: 'skill_ctrl_state_space', minMasteryLevel: 2 },
    { id: 'dep_29', dependentId: 'skill_sim_gazebo', prerequisiteId: 'skill_sim_physics', minMasteryLevel: 2 },
    { id: 'dep_30', dependentId: 'skill_sim_gazebo', prerequisiteId: 'skill_ros_basics', minMasteryLevel: 2 },
  ];

  for (const dep of dependencies) {
    await prisma.skillDependency.upsert({
      where: { dependentId_prerequisiteId: { dependentId: dep.dependentId, prerequisiteId: dep.prerequisiteId } },
      update: dep,
      create: dep,
    });
  }

  // Create initial mastery records for all skills
  for (const skill of skills) {
    await prisma.masteryRecord.upsert({
      where: { skillId: skill.id },
      update: {},
      create: { skillId: skill.id, level: 0, confidence: 0.5 },
    });
  }

  console.log(`  ✓ Seeded ${skills.length} skills, ${dependencies.length} dependencies, and mastery records`);
}

module.exports = { seedSkills };
