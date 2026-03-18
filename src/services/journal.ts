import { prisma } from '@/lib/db'
import { todayISO } from '@/lib/utils'

export async function getReflections(limit: number = 30) {
  return prisma.reflectionEntry.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getReflection(id: string) {
  return prisma.reflectionEntry.findUnique({ where: { id } })
}

export async function createReflection(data: {
  content: string
  mood?: number
  whatWentWell?: string
  whatWasHard?: string
  whatILearned?: string
  tags?: string
  promptId?: string
}) {
  return prisma.reflectionEntry.create({
    data: {
      date: todayISO(),
      ...data,
    },
  })
}

export async function updateReflection(id: string, data: {
  content?: string
  mood?: number
  whatWentWell?: string
  whatWasHard?: string
  whatILearned?: string
  tags?: string
}) {
  return prisma.reflectionEntry.update({
    where: { id },
    data,
  })
}

export async function getFounderPromptForWeek(weekNumber: number) {
  return prisma.founderPrompt.findFirst({
    where: { weekNumber },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getFounderPrompts(limit: number = 10) {
  return prisma.founderPrompt.findMany({
    orderBy: { weekNumber: 'asc' },
    take: limit,
  })
}

export async function getUserSettings() {
  let settings = await prisma.userSettings.findFirst()
  if (!settings) {
    settings = await prisma.userSettings.create({ data: {} })
  }
  return settings
}

export async function updateUserSettings(data: {
  displayName?: string
  dailyGoalMinutes?: number
  theme?: string
  currentMonth?: number
  onboardingComplete?: boolean
}) {
  const settings = await getUserSettings()
  return prisma.userSettings.update({
    where: { id: settings.id },
    data,
  })
}
