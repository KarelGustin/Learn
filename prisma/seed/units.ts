async function seedUnits(prisma: any) {
  const units = [
    // ─── PYTHON BASICS ───────────────────────────────────
    {
      id: 'unit_py_variables',
      moduleId: 'mod_python_basics',
      name: 'Variables & Data Types',
      slug: 'python-variables-data-types',
      description: 'Learn how Python stores data using variables, and understand the fundamental data types: integers, floats, strings, and booleans.',
      sortOrder: 1,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_py_operators',
      moduleId: 'mod_python_basics',
      name: 'Operators & Expressions',
      slug: 'python-operators-expressions',
      description: 'Arithmetic, comparison, logical, and assignment operators. Build expressions that compute useful values.',
      sortOrder: 2,
      estimatedMinutes: 75,
    },
    {
      id: 'unit_py_strings',
      moduleId: 'mod_python_basics',
      name: 'Working with Strings',
      slug: 'python-working-with-strings',
      description: 'String methods, formatting, slicing, and manipulation. Essential for parsing sensor data and log output.',
      sortOrder: 3,
      estimatedMinutes: 60,
    },
    {
      id: 'unit_py_io',
      moduleId: 'mod_python_basics',
      name: 'Input, Output & File Handling',
      slug: 'python-io-files',
      description: 'Read from and write to the console and files. Handle configuration files and data logs for robotic systems.',
      sortOrder: 4,
      estimatedMinutes: 60,
    },

    // ─── PYTHON CONTROL FLOW ─────────────────────────────
    {
      id: 'unit_py_conditionals',
      moduleId: 'mod_python_control_flow',
      name: 'Conditionals',
      slug: 'python-conditionals',
      description: 'if, elif, else statements. Make your programs respond to different conditions and sensor readings.',
      sortOrder: 1,
      estimatedMinutes: 75,
    },
    {
      id: 'unit_py_loops',
      moduleId: 'mod_python_control_flow',
      name: 'Loops & Iteration',
      slug: 'python-loops-iteration',
      description: 'for and while loops, break, continue, and iterating over data structures. Process sensor arrays and repeat actions.',
      sortOrder: 2,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_py_functions',
      moduleId: 'mod_python_control_flow',
      name: 'Functions & Scope',
      slug: 'python-functions-scope',
      description: 'Define reusable functions with parameters and return values. Understand variable scope and modular code design.',
      sortOrder: 3,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_py_errors',
      moduleId: 'mod_python_control_flow',
      name: 'Error Handling',
      slug: 'python-error-handling',
      description: 'try/except blocks, custom exceptions, and defensive programming. Build robust code that handles hardware failures gracefully.',
      sortOrder: 4,
      estimatedMinutes: 60,
    },

    // ─── PYTHON DATA STRUCTURES ──────────────────────────
    {
      id: 'unit_py_lists',
      moduleId: 'mod_python_data',
      name: 'Lists & Tuples',
      slug: 'python-lists-tuples',
      description: 'Ordered collections for storing sensor readings, waypoints, and sequential data in robotics applications.',
      sortOrder: 1,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_py_dicts',
      moduleId: 'mod_python_data',
      name: 'Dictionaries & Sets',
      slug: 'python-dictionaries-sets',
      description: 'Key-value mappings and unique collections. Store robot configurations, parameter lookups, and component registries.',
      sortOrder: 2,
      estimatedMinutes: 75,
    },

    // ─── DC CIRCUITS ─────────────────────────────────────
    {
      id: 'unit_ee_voltage_current',
      moduleId: 'mod_dc_circuits',
      name: 'Voltage, Current & Resistance',
      slug: 'voltage-current-resistance',
      description: 'The three fundamental electrical quantities. Understand what makes electricity flow and how components resist it.',
      sortOrder: 1,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_ee_ohms_law',
      moduleId: 'mod_dc_circuits',
      name: "Ohm's Law & Power",
      slug: 'ohms-law-power',
      description: "V=IR and P=IV. Calculate voltages, currents, and power dissipation in circuits that drive robot motors and sensors.",
      sortOrder: 2,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_ee_series_parallel',
      moduleId: 'mod_dc_circuits',
      name: 'Series & Parallel Circuits',
      slug: 'series-parallel-circuits',
      description: 'Analyze circuits with components in series and parallel. Design voltage dividers and current sharing networks.',
      sortOrder: 3,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_ee_kirchhoff',
      moduleId: 'mod_dc_circuits',
      name: "Kirchhoff's Laws",
      slug: 'kirchhoffs-laws',
      description: "KVL and KCL for analyzing complex circuits. Essential for understanding multi-node robot power distribution.",
      sortOrder: 4,
      estimatedMinutes: 75,
    },

    // ─── STATICS & FORCES ────────────────────────────────
    {
      id: 'unit_me_vectors',
      moduleId: 'mod_statics',
      name: 'Force Vectors',
      slug: 'force-vectors',
      description: 'Represent forces as vectors, resolve into components, and add forces graphically and analytically.',
      sortOrder: 1,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_me_equilibrium',
      moduleId: 'mod_statics',
      name: 'Equilibrium & Free Body Diagrams',
      slug: 'equilibrium-fbd',
      description: 'Draw free body diagrams and apply equilibrium equations to analyze forces on robotic structures and joints.',
      sortOrder: 2,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_me_moments',
      moduleId: 'mod_statics',
      name: 'Moments & Torques',
      slug: 'moments-torques',
      description: 'Calculate moments about a point, understand torque on robot joints, and apply moment equilibrium.',
      sortOrder: 3,
      estimatedMinutes: 75,
    },

    // ─── LINEAR ALGEBRA ──────────────────────────────────
    {
      id: 'unit_la_vectors',
      moduleId: 'mod_linear_algebra',
      name: 'Vectors & Vector Spaces',
      slug: 'vectors-vector-spaces',
      description: 'Vector operations, dot product, cross product, and linear independence. The language of robot positions and orientations.',
      sortOrder: 1,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_la_matrices',
      moduleId: 'mod_linear_algebra',
      name: 'Matrices & Transformations',
      slug: 'matrices-transformations',
      description: 'Matrix operations, multiplication, inverse, and linear transformations. Represent robot coordinate frame transforms.',
      sortOrder: 2,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_la_eigen',
      moduleId: 'mod_linear_algebra',
      name: 'Eigenvalues & Eigenvectors',
      slug: 'eigenvalues-eigenvectors',
      description: 'Eigendecomposition, principal components, and their role in stability analysis and dimensionality reduction.',
      sortOrder: 3,
      estimatedMinutes: 75,
    },

    // ─── INTRO CONTROL SYSTEMS ───────────────────────────
    {
      id: 'unit_ctrl_feedback',
      moduleId: 'mod_intro_controls',
      name: 'Feedback & Open/Closed Loop',
      slug: 'feedback-open-closed-loop',
      description: 'Understand the difference between open-loop and closed-loop systems. Why feedback is essential for robot control.',
      sortOrder: 1,
      estimatedMinutes: 60,
    },
    {
      id: 'unit_ctrl_modeling',
      moduleId: 'mod_intro_controls',
      name: 'System Modeling',
      slug: 'system-modeling',
      description: 'Model physical systems as transfer functions. Represent motors, springs, and dampers as mathematical models.',
      sortOrder: 2,
      estimatedMinutes: 90,
    },

    // ─── ROS2 GETTING STARTED ────────────────────────────
    {
      id: 'unit_ros2_setup',
      moduleId: 'mod_ros2_intro',
      name: 'ROS2 Setup & Concepts',
      slug: 'ros2-setup-concepts',
      description: 'Install ROS2, understand the computation graph, and learn the core concepts of nodes, topics, and messages.',
      sortOrder: 1,
      estimatedMinutes: 90,
    },
    {
      id: 'unit_ros2_pubsub',
      moduleId: 'mod_ros2_intro',
      name: 'Publishers & Subscribers',
      slug: 'ros2-publishers-subscribers',
      description: 'Create your first ROS2 nodes that send and receive messages. Build the communication backbone of a robot.',
      sortOrder: 2,
      estimatedMinutes: 90,
    },

    // ─── FOUNDER INTRO ───────────────────────────────────
    {
      id: 'unit_founder_why',
      moduleId: 'mod_founder_intro',
      name: 'Why Build Robots?',
      slug: 'why-build-robots',
      description: 'The robotics opportunity, market landscape, and developing your personal founder thesis for robotics.',
      sortOrder: 1,
      estimatedMinutes: 60,
    },
    {
      id: 'unit_founder_learning',
      moduleId: 'mod_founder_intro',
      name: 'Learning How to Learn',
      slug: 'learning-how-to-learn',
      description: 'Deliberate practice, spaced repetition, and building a 12-month self-directed learning system.',
      sortOrder: 2,
      estimatedMinutes: 60,
    },
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { slug: unit.slug },
      update: unit,
      create: unit,
    });
  }

  console.log(`  ✓ Seeded ${units.length} units`);
}

module.exports = { seedUnits };
