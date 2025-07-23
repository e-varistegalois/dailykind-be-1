import { prisma } from '../../db/index';

export const getUserStreakRepository = async (userId: string) => {
  return await prisma.post.findMany({
    where: { userId },
    include: {
      challenge: { select: { timestamp: true } }
    },
    orderBy: { challenge: { timestamp: 'desc' } }
  });
};