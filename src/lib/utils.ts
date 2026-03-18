import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, differenceInDays } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseSkillIds(csv: string): string[] {
  if (!csv || csv.trim() === '') return []
  return csv.split(',').map(s => s.trim()).filter(Boolean)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, yyyy')
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function daysBetween(a: Date | string, b: Date | string): number {
  const dateA = typeof a === 'string' ? new Date(a) : a
  const dateB = typeof b === 'string' ? new Date(b) : b
  return differenceInDays(dateB, dateA)
}

export function minutesToDisplay(mins: number): string {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function masteryLabel(level: number): string {
  const labels = ['Unseen', 'Exposed', 'Shaky', 'Usable', 'Strong', 'Mastered']
  return labels[Math.min(level, 5)] || 'Unknown'
}

export function masteryColor(level: number): string {
  const colors = [
    'text-zinc-500',    // 0
    'text-blue-400',    // 1
    'text-yellow-400',  // 2
    'text-green-400',   // 3
    'text-emerald-400', // 4
    'text-purple-400',  // 5
  ]
  return colors[Math.min(level, 5)] || 'text-zinc-500'
}

export function difficultyLabel(d: string): string {
  const map: Record<string, string> = {
    INTRODUCTORY: 'Intro',
    FOUNDATIONAL: 'Foundation',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert',
  }
  return map[d] || d
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
