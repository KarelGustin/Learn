async function seedFounderPrompts(prisma: any) {
  const prompts = [
    { weekNumber: 1, category: 'vision', prompt: 'What problem in the physical world frustrates you most? Could a robot solve it?', description: 'Start developing your product instinct by connecting frustration to opportunity.' },
    { weekNumber: 2, category: 'market', prompt: 'Name 3 industries where robots are already deployed. What do they all have in common?', description: 'Understand where robotics creates value today.' },
    { weekNumber: 3, category: 'product', prompt: 'If you could build one robot that does one thing perfectly, what would it do?', description: 'Practice radical focus in product definition.' },
    { weekNumber: 4, category: 'risk', prompt: 'What is the hardest technical problem in your dream robot? Why is it hard?', description: 'Learn to identify technical risk early.' },
    { weekNumber: 5, category: 'vision', prompt: 'Who is the customer for your robot? Describe them in detail.', description: 'Build customer empathy from day one.' },
    { weekNumber: 6, category: 'product', prompt: 'What is the simplest possible version of your robot that still delivers value?', description: 'MVP thinking — strip to essentials.' },
    { weekNumber: 7, category: 'market', prompt: 'Research one robotics startup. What are they building? What is their moat?', description: 'Study real companies to learn business patterns.' },
    { weekNumber: 8, category: 'growth', prompt: 'If your robot works perfectly, how does it scale from 1 unit to 1000?', description: 'Think about manufacturing and scaling challenges.' },
    { weekNumber: 9, category: 'risk', prompt: 'What could go wrong with a robot in production? List 5 failure modes.', description: 'Safety and reliability thinking.' },
    { weekNumber: 10, category: 'team', prompt: 'What skills does a robotics founding team need? Where are your gaps?', description: 'Self-awareness about what you need to learn or hire for.' },
    { weekNumber: 11, category: 'product', prompt: 'How would you demo your robot to a potential customer in 60 seconds?', description: 'Practice pitch clarity.' },
    { weekNumber: 12, category: 'market', prompt: 'What is more valuable: a robot that is 10x faster or 10x cheaper? Why?', description: 'Understand different value propositions.' },
    { weekNumber: 13, category: 'vision', prompt: 'In 10 years, what task that humans do today will robots do better?', description: 'Long-term vision exercise.' },
    { weekNumber: 14, category: 'growth', prompt: 'How much would a customer pay per month for your robot-as-a-service?', description: 'Business model thinking.' },
    { weekNumber: 15, category: 'risk', prompt: 'What regulations might affect your robot? Safety, liability, data privacy?', description: 'Understand the regulatory landscape.' },
    { weekNumber: 16, category: 'product', prompt: 'What sensor data does your robot absolutely need? What is nice-to-have?', description: 'Hardware requirements prioritization.' },
    { weekNumber: 17, category: 'team', prompt: 'Would you hire a software engineer or mechanical engineer first? Why?', description: 'Resource allocation thinking.' },
    { weekNumber: 18, category: 'market', prompt: 'Who are the top 3 competitors for your robot idea? What do they charge?', description: 'Competitive analysis practice.' },
    { weekNumber: 19, category: 'vision', prompt: 'What would the world look like if your robot was everywhere?', description: 'Expand your vision.' },
    { weekNumber: 20, category: 'product', prompt: 'If you had to build V1 in 3 months, what would you cut?', description: 'Ruthless prioritization.' },
    { weekNumber: 21, category: 'risk', prompt: 'What is your biggest technical unknown right now? How would you de-risk it?', description: 'Technical risk management.' },
    { weekNumber: 22, category: 'growth', prompt: 'How do you get your first 10 customers?', description: 'Go-to-market for hardware.' },
    { weekNumber: 23, category: 'market', prompt: 'What is the total addressable market for your robot category?', description: 'Market sizing exercise.' },
    { weekNumber: 24, category: 'team', prompt: 'What company culture do you want for your robotics startup?', description: 'Leadership and culture thinking.' },
    { weekNumber: 25, category: 'product', prompt: 'Sketch a system architecture diagram for your robot. What are the major subsystems?', description: 'Systems thinking practice.' },
    { weekNumber: 26, category: 'vision', prompt: 'Mid-year review: Has your robot vision changed? How? Why?', description: 'Reflect on how your thinking has evolved.' },
  ];

  // Generate remaining prompts for weeks 27-104
  const categories = ['vision', 'market', 'product', 'risk', 'team', 'growth'];
  const latePrompts = [
    'How does your robot handle edge cases in unstructured environments?',
    'What is the bill of materials cost for one unit of your robot?',
    'How would you pitch your robotics startup to a VC in 2 minutes?',
    'What data does your robot generate that could become a separate product?',
    'How do you test a robot before deploying it in the real world?',
    'What happens when your robot fails in front of a customer?',
    'How would you build a robotics team in a city with no robotics talent?',
    'What is the maintenance model for your deployed robots?',
    'Should your robot be fully autonomous or teleoperated? Why?',
    'What manufacturing process would you use for 100 units? 10,000?',
    'How do you collect user feedback from a physical product?',
    'What is the environmental impact of your robot?',
    'How would you use simulation to accelerate development?',
    'What insurance or liability issues exist for your robot?',
    'How would you fundraise for a robotics company today?',
    'What partnerships would accelerate your go-to-market?',
    'How do you balance R&D ambition with shipping product?',
    'What is your 18-month product roadmap?',
    'How would you handle a major component shortage?',
    'What metrics define success for your robot product?',
  ];

  for (let w = 27; w <= 104; w++) {
    const cat = categories[(w - 27) % categories.length];
    const promptText = latePrompts[(w - 27) % latePrompts.length];
    prompts.push({
      weekNumber: w,
      category: cat,
      prompt: promptText,
      description: `Week ${w} founder reflection on ${cat}.`,
    });
  }

  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i];
    await prisma.founderPrompt.upsert({
      where: { weekNumber: p.weekNumber },
      update: { ...p, sortOrder: i + 1 },
      create: { id: `fp_${p.weekNumber}`, ...p, sortOrder: i + 1 },
    });
  }

  console.log(`  ✓ Seeded ${prompts.length} founder prompts`);
}

module.exports = { seedFounderPrompts };
