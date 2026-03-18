import { prisma } from '@/lib/db'
import { updateMastery as calcMastery } from '@/engine/mastery'
import { detectStruggles } from '@/engine/struggle-detector'
import type { DifficultyTier, StruggleReport } from '@/types'

export async function getMasteryRecords() {
  return prisma.masteryRecord.findMany({
    include: { skill: { include: { domain: true } } },
  })
}

export async function getMasteryForSkill(skillId: string) {
  return prisma.masteryRecord.findUnique({
    where: { skillId },
    include: { skill: true },
  })
}

export async function getDomainMasteryOverview() {
  const records = await prisma.masteryRecord.findMany({
    include: { skill: { include: { domain: true } } },
  })

  const domainMap = new Map<string, { name: string; color: string; levels: number[]; total: number }>()

  for (const record of records) {
    const domain = record.skill.domain
    if (!domainMap.has(domain.id)) {
      domainMap.set(domain.id, { name: domain.name, color: domain.color, levels: [], total: 0 })
    }
    const entry = domainMap.get(domain.id)!
    entry.levels.push(record.level)
    entry.total++
  }

  return Array.from(domainMap.entries()).map(([domainId, data]) => ({
    domainId,
    name: data.name,
    color: data.color,
    avgMastery: data.levels.length > 0
      ? Math.round((data.levels.reduce((s, l) => s + l, 0) / data.levels.length) * 100) / 100
      : 0,
    totalSkills: data.total,
    masteredCount: data.levels.filter(l => l >= 4).length,
  }))
}

export async function recordAttemptAndUpdateMastery(
  exerciseId: string,
  answer: string,
  correct: boolean,
  timeSpentMs: number,
  hints: number,
  selfConfidence: number
) {
  const attempt = await prisma.attempt.create({
    data: {
      exerciseId,
      answer,
      correct,
      timeSpentMs,
      hints,
      confidence: selfConfidence,
    },
  })

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  })

  if (!exercise?.skillId) return attempt

  let mastery = await prisma.masteryRecord.findUnique({
    where: { skillId: exercise.skillId },
  })

  if (!mastery) {
    mastery = await prisma.masteryRecord.create({
      data: { skillId: exercise.skillId },
    })
  }

  const result = calcMastery(
    {
      level: mastery.level,
      confidence: mastery.confidence,
      totalAttempts: mastery.totalAttempts,
      correctAttempts: mastery.correctAttempts,
      streakCorrect: mastery.streakCorrect,
      streakWrong: mastery.streakWrong,
      velocity: mastery.velocity,
      lastPracticed: mastery.lastPracticed,
      lastLevelChange: mastery.lastLevelChange,
    },
    {
      skillId: exercise.skillId,
      wasCorrect: correct,
      difficulty: (exercise.difficulty || 'FOUNDATIONAL') as DifficultyTier,
      timeSpentMs,
      hintsUsed: hints,
      confidence: selfConfidence,
    }
  )

  await prisma.masteryRecord.update({
    where: { skillId: exercise.skillId },
    data: {
      level: result.level,
      confidence: result.confidence,
      totalAttempts: result.totalAttempts,
      correctAttempts: result.correctAttempts,
      streakCorrect: result.streakCorrect,
      streakWrong: result.streakWrong,
      velocity: result.velocity,
      lastPracticed: new Date(),
      lastLevelChange: result.levelChanged ? new Date() : mastery.lastLevelChange,
    },
  })

  return attempt
}

export async function getStrugglingSkills(): Promise<StruggleReport[]> {
  const records = await prisma.masteryRecord.findMany({
    where: { totalAttempts: { gt: 0 } },
    include: { skill: true },
  })

  return detectStruggles(
    records.map(r => ({
      skillId: r.skillId,
      skillName: r.skill.name,
      level: r.level,
      confidence: r.confidence,
      totalAttempts: r.totalAttempts,
      correctAttempts: r.correctAttempts,
      streakWrong: r.streakWrong,
      lastPracticed: r.lastPracticed,
      lastLevelChange: r.lastLevelChange,
    }))
  )
}

export async function getSkillsWithMastery() {
  return prisma.skill.findMany({
    include: {
      domain: true,
      masteryRecord: true,
      dependsOn: { include: { prerequisite: true } },
      dependedOnBy: { include: { dependent: true } },
    },
    orderBy: { name: 'asc' },
  })
}
