import { prisma } from '../../db/index';

export const findChallengeByTimestamp = async (timestamp: Date) => {
  return prisma.challenge.findFirst({
    where: { timestamp },
  })
}

export const findChallengeById = async (id: string) => {
  return prisma.challenge.findUnique({
    where: { id },
  });
}

export const createChallenge = async (content: string, timestamp: Date) => {
  return prisma.challenge.create({
    data: {
      content,
      timestamp,
    },
  })
}

export const inactivateChallenge = async (id: string) => {
  return prisma.challenge.update({
    where: { id },
    data: { isActive: false },
  });
}