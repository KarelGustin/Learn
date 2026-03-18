async function seedExercises(prisma: any) {
  const exercises = [
    // Python Variables
    {
      id: 'ex_py_var_1',
      lessonId: 'les_py_variables',
      type: 'MULTIPLE_CHOICE',
      question: 'What is the value of x after: x = 10; x = "hello"?',
      options: JSON.stringify(['10', '"hello"', 'Error', 'None']),
      correctAnswer: JSON.stringify('"hello"'),
      explanation: 'Python is dynamically typed. When you assign "hello" to x, it replaces the integer 10. x now refers to the string "hello".',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      skillId: 'skill_py_variables',
    },
    {
      id: 'ex_py_var_2',
      lessonId: 'les_py_variables',
      type: 'MULTIPLE_CHOICE',
      question: 'Which variable name follows Python convention for a constant?',
      options: JSON.stringify(['maxSpeed', 'MAX_SPEED', 'max_speed', 'MaxSpeed']),
      correctAnswer: JSON.stringify('MAX_SPEED'),
      explanation: 'Python convention uses UPPER_SNAKE_CASE for constants (e.g., MAX_SPEED = 10.0). Regular variables use lower_snake_case.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 2,
      skillId: 'skill_py_variables',
    },
    // Python Numbers
    {
      id: 'ex_py_num_1',
      lessonId: 'les_py_numbers',
      type: 'MULTIPLE_CHOICE',
      question: 'What is the result of 7 // 2 in Python?',
      options: JSON.stringify(['3.5', '3', '4', '3.0']),
      correctAnswer: JSON.stringify('3'),
      explanation: 'The // operator performs floor division, which divides and rounds down to the nearest integer. 7 // 2 = 3.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      skillId: 'skill_py_math',
    },
    {
      id: 'ex_py_num_2',
      lessonId: 'les_py_numbers',
      type: 'SHORT_ANSWER',
      question: 'A wheel has radius 0.1 meters. What is its circumference? (Use π ≈ 3.14, answer to 2 decimal places)',
      options: null,
      correctAnswer: JSON.stringify('0.63'),
      explanation: 'Circumference = 2πr = 2 × 3.14 × 0.1 = 0.628, rounded to 0.63 meters.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 2,
      skillId: 'skill_py_math',
    },
    // Python Conditionals
    {
      id: 'ex_py_cond_1',
      lessonId: 'les_py_conditionals',
      type: 'MULTIPLE_CHOICE',
      question: 'What prints when distance = 0.5?\n\nif distance < 0.3:\n    print("STOP")\nelif distance < 1.0:\n    print("SLOW")\nelse:\n    print("GO")',
      options: JSON.stringify(['STOP', 'SLOW', 'GO', 'Error']),
      correctAnswer: JSON.stringify('SLOW'),
      explanation: 'distance = 0.5 is not < 0.3 (first condition false), but it IS < 1.0 (elif is true), so "SLOW" prints.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      skillId: 'skill_py_control_flow',
    },
    {
      id: 'ex_py_cond_2',
      lessonId: 'les_py_conditionals',
      type: 'TRUE_FALSE',
      question: 'The expression "not (True and False)" evaluates to True.',
      options: JSON.stringify(['True', 'False']),
      correctAnswer: JSON.stringify('True'),
      explanation: 'True and False = False. not False = True.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 2,
      skillId: 'skill_py_control_flow',
    },
    // Python Loops
    {
      id: 'ex_py_loop_1',
      lessonId: 'les_py_loops',
      type: 'MULTIPLE_CHOICE',
      question: 'How many times does this loop execute?\n\nfor i in range(5):\n    print(i)',
      options: JSON.stringify(['4', '5', '6', 'Infinite']),
      correctAnswer: JSON.stringify('5'),
      explanation: 'range(5) generates 0, 1, 2, 3, 4 — exactly 5 values, so the loop runs 5 times.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      skillId: 'skill_py_control_flow',
    },
    // Python Functions
    {
      id: 'ex_py_func_1',
      lessonId: 'les_py_functions',
      type: 'MULTIPLE_CHOICE',
      question: 'What does this function return?\n\ndef clamp(val, lo, hi):\n    return max(lo, min(hi, val))\n\nclamp(15, 0, 10)',
      options: JSON.stringify(['15', '10', '0', 'None']),
      correctAnswer: JSON.stringify('10'),
      explanation: 'min(10, 15) = 10, then max(0, 10) = 10. The value 15 is clamped to the maximum of 10.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 1,
      skillId: 'skill_py_functions',
    },
    // EE - Ohm's Law
    {
      id: 'ex_ee_ohm_1',
      lessonId: 'les_ee_ohms_law',
      type: 'MULTIPLE_CHOICE',
      question: 'A 12V supply drives current through a 4kΩ resistor. What is the current?',
      options: JSON.stringify(['3mA', '4mA', '48mA', '0.3mA']),
      correctAnswer: JSON.stringify('3mA'),
      explanation: 'I = V/R = 12V / 4000Ω = 0.003A = 3mA',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 1,
      skillId: 'skill_ee_ohms_law',
    },
    {
      id: 'ex_ee_ohm_2',
      lessonId: 'les_ee_ohms_law',
      type: 'SHORT_ANSWER',
      question: 'What resistance is needed to limit current to 20mA from a 5V supply? (Answer in Ohms, whole number)',
      options: null,
      correctAnswer: JSON.stringify('250'),
      explanation: 'R = V/I = 5V / 0.020A = 250Ω',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 2,
      skillId: 'skill_ee_ohms_law',
    },
    // EE - Series/Parallel
    {
      id: 'ex_ee_sp_1',
      lessonId: 'les_ee_series_parallel',
      type: 'MULTIPLE_CHOICE',
      question: 'Three 100Ω resistors in series have a total resistance of:',
      options: JSON.stringify(['33.3Ω', '100Ω', '300Ω', '10000Ω']),
      correctAnswer: JSON.stringify('300Ω'),
      explanation: 'In series: R_total = R1 + R2 + R3 = 100 + 100 + 100 = 300Ω',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 1,
      skillId: 'skill_ee_circuits',
    },
    // Math - Vectors
    {
      id: 'ex_math_vec_1',
      lessonId: 'les_math_vectors',
      type: 'MULTIPLE_CHOICE',
      question: 'What is the magnitude of the vector (3, 4)?',
      options: JSON.stringify(['7', '5', '12', '25']),
      correctAnswer: JSON.stringify('5'),
      explanation: '|v| = √(3² + 4²) = √(9 + 16) = √25 = 5. This is the classic 3-4-5 right triangle.',
      difficulty: 'FOUNDATIONAL',
      sortOrder: 1,
      skillId: 'skill_math_vectors',
    },
    // Git
    {
      id: 'ex_git_1',
      lessonId: 'les_git_basics',
      type: 'MULTIPLE_CHOICE',
      question: 'What does "git add ." do?',
      options: JSON.stringify([
        'Creates a new commit',
        'Stages all changed files for the next commit',
        'Pushes code to remote',
        'Creates a new branch'
      ]),
      correctAnswer: JSON.stringify('Stages all changed files for the next commit'),
      explanation: '"git add ." stages all modified and new files in the current directory for the next commit. The commit itself happens with "git commit".',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      skillId: 'skill_git_basics',
    },
    // Linux
    {
      id: 'ex_linux_1',
      lessonId: 'les_linux_terminal',
      type: 'MULTIPLE_CHOICE',
      question: 'Which command shows the current working directory?',
      options: JSON.stringify(['ls', 'cd', 'pwd', 'dir']),
      correctAnswer: JSON.stringify('pwd'),
      explanation: 'pwd stands for "print working directory" and displays the full path of where you currently are in the filesystem.',
      difficulty: 'INTRODUCTORY',
      sortOrder: 1,
      skillId: 'skill_linux_terminal',
    },
  ];

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: ex,
      create: ex,
    });
  }

  console.log(`  ✓ Seeded ${exercises.length} exercises`);
}

module.exports = { seedExercises };
