const { PrismaClient } = require('@prisma/client');
const { seedDomains } = require('./domains');
const { seedTracks } = require('./tracks');
const { seedModules } = require('./modules');
const { seedUnits } = require('./units');
const { seedSkills } = require('./skills');
const { seedLessons } = require('./lessons');
const { seedExercises } = require('./exercises');
const { seedProjects } = require('./projects');
const { seedFounderPrompts } = require('./founder-prompts');

const prisma = new PrismaClient();

async function main() {
  console.log('\n🤖 RoboLearn — Seeding database...\n');

  // Clear existing data in reverse dependency order
  console.log('  Clearing existing data...');
  await prisma.attempt.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.dailyPlanItem.deleteMany();
  await prisma.dailyPlan.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.reflectionEntry.deleteMany();
  await prisma.reviewItem.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.module.deleteMany();
  await prisma.masteryRecord.deleteMany();
  await prisma.skillDependency.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.track.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.founderPrompt.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.userSettings.deleteMany();
  console.log('  ✓ Cleared\n');

  // Seed in dependency order
  await seedDomains(prisma);
  await seedTracks(prisma);
  await seedModules(prisma);
  await seedUnits(prisma);
  await seedSkills(prisma);
  await seedLessons(prisma);
  await seedExercises(prisma);
  await seedProjects(prisma);
  await seedFounderPrompts(prisma);

  // Create singleton records
  await prisma.userSettings.create({
    data: {
      id: 'settings_main',
      displayName: 'Learner',
      dailyGoalMinutes: 90,
      theme: 'dark',
      currentMonth: 1,
      onboardingComplete: false,
    },
  });

  await prisma.streak.create({
    data: {
      id: 'streak_main',
      currentStreak: 0,
      longestStreak: 0,
      totalDaysActive: 0,
    },
  });

  console.log('  ✓ Created user settings and streak');

  // Enable WAL mode for better performance
  await prisma.$queryRawUnsafe('PRAGMA journal_mode=WAL;');
  console.log('  ✓ Enabled WAL mode');

  console.log('\n✅ Seed complete!\n');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
