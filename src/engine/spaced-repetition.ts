interface ReviewState {
  interval: number    // days until next review
  repetition: number  // consecutive correct count
  efactor: number     // easiness factor (≥ 1.3)
}

interface ReviewResult extends ReviewState {
  nextReview: Date
  isLeech: boolean
}

/**
 * SM-2 spaced repetition algorithm with extensions.
 * Grade 0-5:
 *   0 = complete blackout
 *   1 = incorrect, but upon seeing answer, remembered
 *   2 = incorrect, but answer seemed easy to recall
 *   3 = correct with serious difficulty
 *   4 = correct after hesitation
 *   5 = perfect response
 */
export function gradeReview(
  state: ReviewState,
  grade: 0 | 1 | 2 | 3 | 4 | 5,
  resetCount: number = 0
): ReviewResult {
  let { interval, repetition, efactor } = state

  if (grade >= 3) {
    // Correct response
    if (repetition === 0) {
      interval = 1
    } else if (repetition === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * efactor)
    }
    repetition += 1
  } else {
    // Incorrect - reset
    repetition = 0
    interval = 1
  }

  // Update easiness factor
  efactor = efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  efactor = Math.max(1.3, efactor)

  // Extension: bonus interval for perfect recall with high confidence
  if (grade === 5 && repetition >= 3) {
    interval = Math.round(interval * 1.3)
  }

  // Extension: leech detection
  const isLeech = resetCount >= 5

  // Calculate next review date
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    interval,
    repetition,
    efactor: Math.round(efactor * 100) / 100,
    nextReview,
    isLeech,
  }
}

/**
 * Determine if a review item is due for review.
 */
export function isDue(nextReview: Date | string): boolean {
  const reviewDate = typeof nextReview === 'string' ? new Date(nextReview) : nextReview
  return reviewDate <= new Date()
}

/**
 * Calculate urgency score for a review item (higher = more urgent).
 */
export function reviewUrgency(nextReview: Date | string, efactor: number): number {
  const reviewDate = typeof nextReview === 'string' ? new Date(nextReview) : nextReview
  const daysOverdue = (Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24)

  if (daysOverdue <= 0) return 0 // Not yet due

  // Higher urgency for overdue items with lower efactor (harder items)
  return daysOverdue * (3.0 / efactor)
}

/**
 * Create initial review state for a new item.
 */
export function createReviewState(): ReviewState {
  return {
    interval: 1,
    repetition: 0,
    efactor: 2.5,
  }
}

/**
 * Get a human-readable description of when the next review is.
 */
export function reviewScheduleLabel(interval: number): string {
  if (interval <= 1) return 'Tomorrow'
  if (interval <= 7) return `In ${interval} days`
  if (interval <= 30) return `In ${Math.round(interval / 7)} weeks`
  if (interval <= 365) return `In ${Math.round(interval / 30)} months`
  return `In ${Math.round(interval / 365)} years`
}
