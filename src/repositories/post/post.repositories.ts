import { prisma } from '../../db/index';

export const createPost = async (data: {
  user_id: string;
  challenge_id: string;
  text?: string ;
  image_url?: string;
}) => {
  return prisma.post.create({
    data: {
      userId: data.user_id,
      challengeId: data.challenge_id,
      content: data.text,
      imageUrl: data.image_url,
    },
  });
};