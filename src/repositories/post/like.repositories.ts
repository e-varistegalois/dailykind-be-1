import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLike = async (userId: string, postId: string) => {
  await prisma.like.create({
    data: { userId, postId }
  });

  await prisma.post.update({
    where: { id: postId },
    data: {
      likesCount: { increment: 1 }
    }
  });
};

export const deleteLike = async (userId: string, postId: string) => {
  await prisma.like.delete({
    where: { userId_postId: { userId, postId } }
  });

  await prisma.post.update({
    where: { id: postId },
    data: {
      likesCount: { decrement: 1 }
    }
  });
};

export const hasLiked = async (userId: string, postId: string) => {
  return prisma.like.findUnique({
    where: { userId_postId: { userId, postId } }
  });
};
