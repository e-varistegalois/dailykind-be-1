import { prisma } from '../../db/index';

export const findChallengeByTimestamp = async (timestamp: Date) => {
  return prisma.challenge.findFirst({
    where: { timestamp },
  })
}

export const createChallenge = async (content: string, timestamp: Date) => {
  return prisma.challenge.create({
    data: {
      content,
      timestamp,
    },
  })
}