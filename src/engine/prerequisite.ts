interface Dependency {
  dependentId: string
  prerequisiteId: string
  minMasteryLevel: number
}

/**
 * Check if all prerequisites for a skill are met.
 */
export function prerequisitesMet(
  skillId: string,
  dependencies: Dependency[],
  masteryLevels: Map<string, number>
): { met: boolean; unmet: { skillId: string; required: number; current: number }[] } {
  const prereqs = dependencies.filter(d => d.dependentId === skillId)
  const unmet: { skillId: string; required: number; current: number }[] = []

  for (const dep of prereqs) {
    const currentLevel = masteryLevels.get(dep.prerequisiteId) ?? 0
    if (currentLevel < dep.minMasteryLevel) {
      unmet.push({
        skillId: dep.prerequisiteId,
        required: dep.minMasteryLevel,
        current: currentLevel,
      })
    }
  }

  return { met: unmet.length === 0, unmet }
}

/**
 * Get all skills that are unlocked (prerequisites met).
 */
export function getUnlockedSkills(
  allSkillIds: string[],
  dependencies: Dependency[],
  masteryLevels: Map<string, number>
): string[] {
  return allSkillIds.filter(id => {
    const { met } = prerequisitesMet(id, dependencies, masteryLevels)
    return met
  })
}

/**
 * Walk back the dependency graph to find root prerequisites for a struggling skill.
 * Returns skill IDs that should be remediated first.
 */
export function findRemediationPath(
  skillId: string,
  dependencies: Dependency[],
  masteryLevels: Map<string, number>,
  maxDepth: number = 3
): string[] {
  const result: string[] = []
  const visited = new Set<string>()

  function walk(id: string, depth: number) {
    if (depth > maxDepth || visited.has(id)) return
    visited.add(id)

    const prereqs = dependencies.filter(d => d.dependentId === id)
    for (const dep of prereqs) {
      const level = masteryLevels.get(dep.prerequisiteId) ?? 0
      if (level < dep.minMasteryLevel) {
        result.push(dep.prerequisiteId)
        walk(dep.prerequisiteId, depth + 1)
      }
    }
  }

  walk(skillId, 0)
  return Array.from(new Set(result))
}

/**
 * Topological sort of skill dependencies.
 * Returns skills in an order where prerequisites come first.
 */
export function topologicalSort(
  skillIds: string[],
  dependencies: Dependency[]
): string[] {
  const inDegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  for (const id of skillIds) {
    inDegree.set(id, 0)
    adjacency.set(id, [])
  }

  for (const dep of dependencies) {
    if (skillIds.includes(dep.dependentId) && skillIds.includes(dep.prerequisiteId)) {
      adjacency.get(dep.prerequisiteId)!.push(dep.dependentId)
      inDegree.set(dep.dependentId, (inDegree.get(dep.dependentId) ?? 0) + 1)
    }
  }

  const queue: string[] = []
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id)
  }

  const sorted: string[] = []
  while (queue.length > 0) {
    const current = queue.shift()!
    sorted.push(current)
    for (const neighbor of adjacency.get(current) ?? []) {
      const newDegree = (inDegree.get(neighbor) ?? 1) - 1
      inDegree.set(neighbor, newDegree)
      if (newDegree === 0) queue.push(neighbor)
    }
  }

  return sorted
}
