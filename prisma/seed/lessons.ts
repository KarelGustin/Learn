async function seedLessons(prisma: any) {
  const lessons = [
    // PYTHON FUNDAMENTALS - Variables & Data Types
    {
      id: 'les_py_variables',
      unitId: 'unit_py_variables',
      title: 'Variables and Assignment',
      slug: 'python-variables-assignment',
      content: `# Variables and Assignment in Python

A **variable** is a name that refers to a value stored in memory. In Python, you create a variable by assigning a value to a name using the \`=\` operator.

\`\`\`python
speed = 3.5        # float: robot speed in m/s
sensor_count = 8   # int: number of sensors
robot_name = "Atlas"  # string
is_active = True   # boolean
\`\`\`

## Dynamic Typing

Python is dynamically typed — you don't declare the type. The interpreter infers it:

\`\`\`python
x = 10       # x is an int
x = "hello"  # now x is a string (this is valid!)
\`\`\`

## Naming Rules

- Start with a letter or underscore
- Use \`snake_case\` for variables and functions
- Constants use \`UPPER_CASE\` by convention

\`\`\`python
MAX_SPEED = 10.0       # constant
motor_voltage = 12.0   # regular variable
_internal_state = 0    # "private" convention
\`\`\`

## Why This Matters for Robotics

Every sensor reading, motor command, and state variable in your robot software is stored in a variable. Understanding types prevents bugs like sending a string where a float is expected, which could crash your robot controller.`,
      contentFormat: 'MARKDOWN',
      sortOrder: 1,
      estimatedMinutes: 10,
      skillIds: ['skill_py_variables'],
    },
    {
      id: 'les_py_numbers',
      unitId: 'unit_py_variables',
      title: 'Numbers and Arithmetic',
      slug: 'python-numbers-arithmetic',
      content: `# Numbers and Arithmetic

Python has two main numeric types: **int** (integers) and **float** (decimals).

\`\`\`python
wheel_radius = 0.05    # meters (float)
gear_ratio = 48        # teeth count (int)
pi = 3.14159           # mathematical constant
\`\`\`

## Arithmetic Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`+\` | Addition | \`3 + 2 = 5\` |
| \`-\` | Subtraction | \`10 - 4 = 6\` |
| \`*\` | Multiplication | \`3 * 7 = 21\` |
| \`/\` | Division (float) | \`7 / 2 = 3.5\` |
| \`//\` | Floor division | \`7 // 2 = 3\` |
| \`%\` | Modulus | \`7 % 2 = 1\` |
| \`**\` | Power | \`2 ** 3 = 8\` |

## Robotics Example: Wheel Circumference

\`\`\`python
import math

wheel_radius = 0.05  # 5cm in meters
circumference = 2 * math.pi * wheel_radius
print(f"Wheel circumference: {circumference:.4f} m")
# Output: Wheel circumference: 0.3142 m
\`\`\`

## Type Conversion

\`\`\`python
sensor_reading = "3.7"
voltage = float(sensor_reading)  # string -> float
count = int(3.9)                 # float -> int (truncates to 3)
\`\`\``,
      contentFormat: 'MARKDOWN',
      sortOrder: 2,
      estimatedMinutes: 12,
      skillIds: ['skill_py_variables', 'skill_py_math'],
    },
    {
      id: 'les_py_strings',
      unitId: 'unit_py_variables',
      title: 'Strings and Text Processing',
      slug: 'python-strings',
      content: `# Strings and Text Processing

Strings are sequences of characters, used extensively for logging, debugging, and communication protocols in robotics.

\`\`\`python
status = "IDLE"
error_msg = 'Motor overheated at joint 3'
multiline = """Robot diagnostic report:
  Battery: 78%
  Temperature: 42°C"""
\`\`\`

## String Operations

\`\`\`python
# Concatenation
full_msg = "Robot " + robot_name + " is " + status.lower()

# f-strings (Python 3.6+) — preferred
msg = f"Speed: {speed:.2f} m/s, Sensors: {sensor_count}"

# Common methods
"  hello  ".strip()      # "hello"
"ROS_TOPIC".lower()      # "ros_topic"
"/cmd_vel".split("/")    # ["", "cmd_vel"]
"motor_3".startswith("motor")  # True
\`\`\`

## Why This Matters

ROS topics, sensor data parsing, log messages, and serial communication all involve string manipulation. You'll format sensor readings for display and parse incoming data from hardware.`,
      contentFormat: 'MARKDOWN',
      sortOrder: 3,
      estimatedMinutes: 10,
      skillIds: ['skill_py_variables'],
    },
    // PYTHON - Control Flow
    {
      id: 'les_py_conditionals',
      unitId: 'unit_py_conditionals',
      title: 'Conditionals: if, elif, else',
      slug: 'python-conditionals',
      content: `# Conditionals

Decision-making is fundamental to robot behavior. Conditionals let your code respond to different situations.

\`\`\`python
distance = get_sensor_reading()

if distance < 0.3:
    stop_motor()
    print("OBSTACLE! Emergency stop.")
elif distance < 1.0:
    slow_down()
    print("Object nearby, reducing speed.")
else:
    full_speed()
    print("Path clear.")
\`\`\`

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| \`==\` | Equal to |
| \`!=\` | Not equal to |
| \`<\`, \`>\` | Less/greater than |
| \`<=\`, \`>=\` | Less/greater or equal |

## Boolean Logic

\`\`\`python
# AND: both must be true
if battery > 20 and not is_charging:
    continue_mission()

# OR: at least one must be true
if temperature > 80 or current > 5.0:
    emergency_shutdown()

# NOT: inverts the condition
if not sensor.is_calibrated:
    calibrate(sensor)
\`\`\`

## Robotics Pattern: State Machine

\`\`\`python
state = "SEARCHING"

if state == "SEARCHING":
    scan_environment()
elif state == "APPROACHING":
    move_toward_target()
elif state == "GRASPING":
    close_gripper()
elif state == "RETURNING":
    navigate_home()
\`\`\``,
      contentFormat: 'MARKDOWN',
      sortOrder: 1,
      estimatedMinutes: 15,
      skillIds: ['skill_py_control_flow'],
    },
    {
      id: 'les_py_loops',
      unitId: 'unit_py_conditionals',
      title: 'Loops: for and while',
      slug: 'python-loops',
      content: `# Loops

Loops repeat code — essential for sensor polling, control loops, and data processing.

## For Loops

\`\`\`python
# Iterate over a list of sensors
sensors = ["lidar", "camera", "imu", "encoder"]
for sensor in sensors:
    print(f"Initializing {sensor}...")

# Range-based loop
for i in range(10):
    print(f"Reading {i}: {get_distance()}")

# With index
for i, sensor in enumerate(sensors):
    print(f"Sensor {i}: {sensor}")
\`\`\`

## While Loops

\`\`\`python
# Classic control loop pattern
running = True
while running:
    sensor_data = read_sensors()
    command = compute_control(sensor_data)
    send_command(command)

    if battery_low():
        running = False

# Count-based
attempts = 0
while attempts < 3:
    if try_connection():
        break
    attempts += 1
\`\`\`

## The Main Robot Loop

Almost every robot runs a **main loop** that continuously:
1. Reads sensor data
2. Processes/decides
3. Sends actuator commands

\`\`\`python
while not shutdown_requested:
    data = read_all_sensors()
    plan = update_plan(data)
    commands = compute_commands(plan)
    execute(commands)
    rate.sleep()  # Maintain fixed loop rate
\`\`\``,
      contentFormat: 'MARKDOWN',
      sortOrder: 2,
      estimatedMinutes: 15,
      skillIds: ['skill_py_control_flow'],
    },
    // PYTHON - Functions
    {
      id: 'les_py_functions',
      unitId: 'unit_py_functions',
      title: 'Defining and Calling Functions',
      slug: 'python-functions',
      content: `# Functions

Functions organize code into reusable blocks. In robotics, functions encapsulate behaviors, calculations, and hardware interactions.

\`\`\`python
def calculate_distance(x1, y1, x2, y2):
    """Calculate Euclidean distance between two points."""
    dx = x2 - x1
    dy = y2 - y1
    return (dx**2 + dy**2) ** 0.5

# Call the function
dist = calculate_distance(0, 0, 3, 4)
print(f"Distance: {dist}")  # 5.0
\`\`\`

## Parameters and Return Values

\`\`\`python
def clamp(value, min_val, max_val):
    """Constrain a value within bounds."""
    return max(min_val, min(max_val, value))

# Clamp motor speed to safe range
speed = clamp(requested_speed, -1.0, 1.0)
\`\`\`

## Default Parameters

\`\`\`python
def move_forward(speed=0.5, duration=1.0):
    """Move robot forward at given speed for given duration."""
    set_velocity(speed, 0.0)
    time.sleep(duration)
    set_velocity(0.0, 0.0)

move_forward()           # uses defaults
move_forward(speed=0.3)  # custom speed
move_forward(0.8, 2.0)   # positional args
\`\`\`

## Returning Multiple Values

\`\`\`python
def get_robot_pose():
    """Return current position and orientation."""
    x = read_encoder_x()
    y = read_encoder_y()
    theta = read_imu_heading()
    return x, y, theta

x, y, heading = get_robot_pose()
\`\`\``,
      contentFormat: 'MARKDOWN',
      sortOrder: 1,
      estimatedMinutes: 15,
      skillIds: ['skill_py_functions'],
    },
    // LINUX
    {
      id: 'les_linux_terminal',
      unitId: 'unit_py_io',
      title: 'The Terminal and Shell Basics',
      slug: 'linux-terminal-basics',
      content: `# The Terminal and Shell Basics

The terminal is your primary interface for robotics development. ROS, embedded systems, and server management all happen through the command line.

## Essential Commands

\`\`\`bash
# Navigation
pwd                # Print working directory
ls                 # List files
ls -la             # List all files with details
cd /home/user      # Change directory
cd ..              # Go up one level
cd ~               # Go to home directory

# File operations
mkdir my_project   # Create directory
touch config.yaml  # Create empty file
cp file.txt copy.txt  # Copy
mv old.txt new.txt    # Move/rename
rm file.txt           # Delete (careful!)

# Viewing files
cat config.yaml    # Print entire file
head -20 log.txt   # First 20 lines
tail -f ros.log    # Follow a log file (live)
\`\`\`

## Why Terminal Matters for Robotics

- **ROS** runs entirely from the terminal
- **SSH** into robots and remote machines
- **Build systems** (cmake, make, colcon) are CLI tools
- **Hardware interfaces** (serial, GPIO) use CLI tools
- **Debugging** via logs, process management

## Key Shortcuts

| Shortcut | Action |
|----------|--------|
| Tab | Auto-complete |
| Ctrl+C | Kill current process |
| Ctrl+R | Search command history |
| Up arrow | Previous command |`,
      contentFormat: 'MARKDOWN',
      sortOrder: 1,
      estimatedMinutes: 15,
      skillIds: ['skill_linux_terminal'],
    },
    // GIT
    {
      id: 'les_git_basics',
      unitId: 'unit_py_io',
      title: 'Git Fundamentals: Init, Add, Commit',
      slug: 'git-fundamentals',
      content: `# Git Fundamentals

Git tracks changes to your code. It's essential for any robotics project — you'll use it to version control robot configurations, launch files, and source code.

## Core Workflow

\`\`\`bash
# Initialize a new repository
git init my_robot_project
cd my_robot_project

# Check status
git status

# Stage files for commit
git add robot_controller.py
git add .  # Stage all changes

# Commit with a message
git commit -m "Add initial robot controller"

# View history
git log --oneline
\`\`\`

## The Three Areas

1. **Working Directory** — your actual files
2. **Staging Area** — changes marked for next commit
3. **Repository** — committed history

## Best Practices for Robotics

- Commit after each working feature
- Write meaningful commit messages
- Never commit large binary files (meshes, datasets)
- Use \`.gitignore\` for build artifacts

\`\`\`
# .gitignore for a ROS project
build/
install/
log/
*.pyc
__pycache__/
\`\`\``,
      contentFormat: 'MARKDOWN',
      sortOrder: 1,
      estimatedMinutes: 12,
      skillIds: ['skill_git_basics'],
    },
    // ELECTRICAL - Ohm's Law
    {
      id: 'les_ee_ohms_law',
      unitId: 'unit_ee_ohms_law',
      title: "Ohm's Law and Resistive Circuits",
      slug: 'ohms-law-resistive-circuits',
      content: `# Ohm's Law

The most fundamental relationship in electrical engineering:

$$V = I \\times R$$

Where:
- **V** = Voltage (Volts) — electrical pressure
- **I** = Current (Amps) — flow of charge
- **R** = Resistance (Ohms) — opposition to flow

## Rearranged Forms

$$I = \\frac{V}{R} \\qquad R = \\frac{V}{I}$$

## Worked Example

A 9V battery powers an LED through a 1kΩ resistor:

$$I = \\frac{V}{R} = \\frac{9V}{1000\\Omega} = 0.009A = 9mA$$

## Power

Power dissipated by a component:

$$P = V \\times I = I^2 \\times R = \\frac{V^2}{R}$$

For our example: $P = 9V \\times 9mA = 81mW$

## Why This Matters for Robotics

Every sensor, motor driver, and microcontroller in your robot obeys Ohm's Law. You need it to:
- Size resistors for LED indicators
- Calculate current draw for power budgets
- Understand voltage dividers for sensor interfacing
- Prevent burning out components by exceeding current ratings`,
      contentFormat: 'MARKDOWN',
      sortOrder: 1,
      estimatedMinutes: 15,
      skillIds: ['skill_ee_ohms_law'],
    },
    {
      id: 'les_ee_series_parallel',
      unitId: 'unit_ee_ohms_law',
      title: 'Series and Parallel Circuits',
      slug: 'series-parallel-circuits',
      content: `# Series and Parallel Circuits

## Series Circuits

Components connected end-to-end. Current is the same through all components.

$$R_{total} = R_1 + R_2 + R_3 + ...$$

$$V_{total} = V_1 + V_2 + V_3 + ...$$

## Parallel Circuits

Components connected across the same two nodes. Voltage is the same across all components.

$$\\frac{1}{R_{total}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3} + ...$$

For two resistors in parallel:
$$R_{total} = \\frac{R_1 \\times R_2}{R_1 + R_2}$$

## Robotics Application: Voltage Divider

A voltage divider converts a higher voltage to a lower one — used constantly for sensor interfacing.

$$V_{out} = V_{in} \\times \\frac{R_2}{R_1 + R_2}$$

Example: Convert 5V sensor output to 3.3V for a microcontroller:
- Use R1 = 1kΩ, R2 = 2kΩ
- $V_{out} = 5V \\times \\frac{2000}{1000 + 2000} = 3.33V$`,
      contentFormat: 'MARKDOWN',
      sortOrder: 2,
      estimatedMinutes: 15,
      skillIds: ['skill_ee_ohms_law', 'skill_ee_circuits'],
    },
    // MATH - Vectors
    {
      id: 'les_math_vectors',
      unitId: 'unit_la_vectors',
      title: 'Vectors and Coordinate Systems',
      slug: 'vectors-coordinate-systems',
      content: `# Vectors and Coordinate Systems

Vectors represent quantities with both magnitude and direction — the language of robotics motion.

## 2D Vectors

A 2D vector: $\\vec{v} = \\begin{pmatrix} v_x \\\\ v_y \\end{pmatrix}$

\`\`\`python
import numpy as np

position = np.array([3.0, 4.0])     # x=3, y=4
velocity = np.array([1.0, -0.5])    # moving right and slightly down
\`\`\`

## Magnitude (Length)

$$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$$

\`\`\`python
magnitude = np.linalg.norm(position)  # 5.0
\`\`\`

## Unit Vectors

A vector with magnitude 1, used for direction only:

$$\\hat{v} = \\frac{\\vec{v}}{|\\vec{v}|}$$

\`\`\`python
direction = velocity / np.linalg.norm(velocity)
\`\`\`

## Vector Operations

- **Addition**: $\\vec{a} + \\vec{b}$ — combining displacements
- **Scalar multiply**: $k \\vec{v}$ — scaling
- **Dot product**: $\\vec{a} \\cdot \\vec{b} = |a||b|\\cos\\theta$ — measures alignment

## Why This Matters

Robot positions, velocities, forces, and sensor readings are all vectors. Understanding them is foundational for everything from path planning to force control.`,
      contentFormat: 'MARKDOWN',
      sortOrder: 1,
      estimatedMinutes: 20,
      skillIds: ['skill_math_vectors'],
    },
  ];

  for (const lesson of lessons) {
    const { skillIds, ...lessonData } = lesson;
    await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: lessonData,
      create: lessonData,
    });

    // Create LessonSkill junction records
    for (const skillId of skillIds) {
      await prisma.lessonSkill.upsert({
        where: {
          lessonId_skillId: { lessonId: lesson.id, skillId },
        },
        update: {},
        create: { lessonId: lesson.id, skillId },
      });
    }
  }

  console.log(`  ✓ Seeded ${lessons.length} lessons`);
}

module.exports = { seedLessons };
