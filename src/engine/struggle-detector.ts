import type { StruggleReport } from '@/types'

interface SkillState {
  skillId: string
  skillName: string
  level: number
  confidence: number
  totalAttempts: number
  correctAttempts: number
  streakWrong: number
  lastPracticed: Date | null
  lastLevelChange: Date | null
}

export function detectStruggles(skills: SkillState[]): StruggleReport[] {
  const reports: StruggleReport[] = []

  for (const skill of skills) {
    // Condition 1: Consecutive failures
    if (skill.streakWrong >= 3) {
      reports.push({
        skillId: skill.skillId,
        skillName: skill.skillName,
        reason: `${skill.streakWrong} consecutive incorrect attempts`,
        severity: skill.streakWrong >= 5 ? 'high' : 'medium',
        suggestedAction: 'Review prerequisite concepts and retry with simpler exercises',
      })
      continue
    }

    // Condition 2: Low confidence with enough data
    if (skill.confidence < 0.3 && skill.totalAttempts >= 5) {
      reports.push({
        skillId: skill.skillId,
        skillName: skill.skillName,
        reason: `Low confidence score (${Math.round(skill.confidence * 100)}%) after ${skill.totalAttempts} attempts`,
        severity: 'medium',
        suggestedAction: 'Schedule additional practice sessions with gradual difficulty increase',
      })
      continue
    }

    // Condition 3: Stalled progress
    if (skill.lastLevelChange && skill.totalAttempts >= 5) {
      const daysSinceLevelChange = (Date.now() - skill.lastLevelChange.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLevelChange > 14 && skill.level < 3) {
        reports.push({
          skillId: skill.skillId,
          skillName: skill.skillName,
          reason: `No level increase in ${Math.round(daysSinceLevelChange)} days despite practice`,
          severity: 'low',
          suggestedAction: 'Try a different learning approach or break the concept into sub-skills',
        })
        continue
      }
    }

    // Condition 4: Low accuracy despite many attempts
    if (skill.totalAttempts >= 10) {
      const accuracy = skill.correctAttempts / skill.totalAttempts
      if (accuracy < 0.4) {
        reports.push({
          skillId: skill.skillId,
          skillName: skill.skillName,
          reason: `Only ${Math.round(accuracy * 100)}% accuracy over ${skill.totalAttempts} attempts`,
          severity: 'high',
          suggestedAction: 'Go back to fundamentals — check if prerequisite skills are solid',
        })
      }
    }
  }

  // Sort by severity: high > medium > low
  const severityOrder = { high: 0, medium: 1, low: 2 }
  reports.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  return reports
}

export function computeOverloadSignal(
  recentDays: { date: string; minutesStudied: number; exercisesFailed: number }[]
): { isOverloaded: boolean; recommendedReduction: number } {
  if (recentDays.length < 3) return { isOverloaded: false, recommendedReduction: 0 }

  const last3 = recentDays.slice(-3)

  // Check for declining performance + increasing time (grinding without progress)
  const avgFailures = last3.reduce((s, d) => s + d.exercisesFailed, 0) / 3
  const avgMinutes = last3.reduce((s, d) => s + d.minutesStudied, 0) / 3

  // Overloaded if: studying a lot but failing a lot
  const isOverloaded = avgMinutes > 120 && avgFailures > 5

  return {
    isOverloaded,
    recommendedReduction: isOverloaded ? Math.round(avgMinutes * 0.3) : 0,
  }
}
