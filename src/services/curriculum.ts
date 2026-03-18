import { prisma } from '@/lib/db'

export async function getDomains() {
  return prisma.domain.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      tracks: {
        orderBy: { sortOrder: 'asc' },
        include: {
          modules: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
      _count: { select: { skills: true } },
    },
  })
}

export async function getDomainBySlug(slug: string) {
  return prisma.domain.findUnique({
    where: { slug },
    include: {
      tracks: {
        orderBy: { sortOrder: 'asc' },
        include: {
          modules: {
            orderBy: { sortOrder: 'asc' },
            include: {
              units: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      },
    },
  })
}

export async function getLesson(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      exercises: { orderBy: { sortOrder: 'asc' } },
      unit: {
        include: {
          module: {
            include: {
              track: {
                include: { domain: true },
              },
            },
          },
        },
      },
    },
  })
}

export async function getLessonBySlug(slug: string) {
  return prisma.lesson.findUnique({
    where: { slug },
    include: {
      exercises: { orderBy: { sortOrder: 'asc' } },
      unit: {
        include: {
          module: {
            include: {
              track: {
                include: { domain: true },
              },
            },
          },
        },
      },
    },
  })
}

export async function getNextLesson() {
  // Find the first lesson that has no completed submission
  const completedLessonIds = await prisma.submission.findMany({
    where: { completed: true },
    select: { lessonId: true },
  }).then(subs => subs.map(s => s.lessonId))

  return prisma.lesson.findFirst({
    where: {
      id: { notIn: completedLessonIds.length > 0 ? completedLessonIds : ['_none_'] },
    },
    orderBy: [
      { unit: { module: { track: { domain: { sortOrder: 'asc' } } } } },
      { unit: { module: { track: { sortOrder: 'asc' } } } },
      { unit: { module: { sortOrder: 'asc' } } },
      { unit: { sortOrder: 'asc' } },
      { sortOrder: 'asc' },
    ],
    include: {
      unit: {
        include: {
          module: {
            include: {
              track: {
                include: { domain: true },
              },
            },
          },
        },
      },
    },
  })
}

export async function getLessonsForUnit(unitId: string) {
  return prisma.lesson.findMany({
    where: { unitId },
    orderBy: { sortOrder: 'asc' },
    include: {
      exercises: { orderBy: { sortOrder: 'asc' } },
      submissions: { where: { completed: true } },
    },
  })
}

export async function getCompletedLessonCount() {
  const completedIds = await prisma.submission.findMany({
    where: { completed: true },
    select: { lessonId: true },
    distinct: ['lessonId'],
  })
  return completedIds.length
}

export async function getTotalLessonCount() {
  return prisma.lesson.count()
}

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      milestones: { orderBy: { sortOrder: 'asc' } },
      module: {
        include: {
          track: {
            include: { domain: true },
          },
        },
      },
    },
  })
}

export async function getProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      milestones: { orderBy: { sortOrder: 'asc' } },
      module: {
        include: {
          track: {
            include: { domain: true },
          },
        },
      },
    },
  })
}
