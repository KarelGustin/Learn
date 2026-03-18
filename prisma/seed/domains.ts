async function seedDomains(prisma: any) {
  const domains = [
    {
      id: 'dom_software',
      name: 'Software Engineering',
      slug: 'software',
      description: 'Master programming fundamentals, data structures, algorithms, and software architecture patterns essential for robotics software development.',
      icon: 'Code',
      color: '#3B82F6',
      sortOrder: 1,
    },
    {
      id: 'dom_electrical',
      name: 'Electrical Engineering',
      slug: 'electrical',
      description: 'Learn circuit design, PCB layout, power systems, sensor interfacing, and embedded electronics for robotic hardware.',
      icon: 'Zap',
      color: '#EAB308',
      sortOrder: 2,
    },
    {
      id: 'dom_mechanical',
      name: 'Mechanical Engineering',
      slug: 'mechanical',
      description: 'Understand mechanics, CAD design, material selection, actuator systems, and structural analysis for building robust robots.',
      icon: 'Wrench',
      color: '#EF4444',
      sortOrder: 3,
    },
    {
      id: 'dom_ml',
      name: 'Machine Learning',
      slug: 'ml',
      description: 'Build intelligent perception and decision-making systems using supervised learning, deep learning, and computer vision.',
      icon: 'Brain',
      color: '#8B5CF6',
      sortOrder: 4,
    },
    {
      id: 'dom_rl',
      name: 'Reinforcement Learning',
      slug: 'rl',
      description: 'Train agents to learn optimal behaviors through trial and error using reward signals, policy gradients, and model-based methods.',
      icon: 'Gamepad',
      color: '#EC4899',
      sortOrder: 5,
    },
    {
      id: 'dom_robotics',
      name: 'Robotics Systems',
      slug: 'robotics',
      description: 'Integrate hardware and software into complete robotic systems using ROS2, SLAM, motion planning, and system architecture.',
      icon: 'Bot',
      color: '#10B981',
      sortOrder: 6,
    },
    {
      id: 'dom_controls',
      name: 'Control Systems',
      slug: 'controls',
      description: 'Design feedback controllers, state estimators, and optimal control strategies to make robots move precisely and reliably.',
      icon: 'Sliders',
      color: '#F97316',
      sortOrder: 7,
    },
    {
      id: 'dom_simulation',
      name: 'Simulation',
      slug: 'simulation',
      description: 'Model and simulate robotic systems in virtual environments using Gazebo, MuJoCo, and Isaac Sim for rapid prototyping and testing.',
      icon: 'Monitor',
      color: '#06B6D4',
      sortOrder: 8,
    },
    {
      id: 'dom_founder',
      name: 'Founder Thinking',
      slug: 'founder',
      description: 'Develop the entrepreneurial mindset, strategic thinking, and leadership skills needed to build a robotics company from scratch.',
      icon: 'Lightbulb',
      color: '#A855F7',
      sortOrder: 9,
    },
  ];

  for (const domain of domains) {
    await prisma.domain.upsert({
      where: { slug: domain.slug },
      update: domain,
      create: domain,
    });
  }

  console.log(`  ✓ Seeded ${domains.length} domains`);
}

module.exports = { seedDomains };
