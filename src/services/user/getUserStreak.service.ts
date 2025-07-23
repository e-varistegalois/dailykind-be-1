import { getUserStreakRepository } from '../../repositories/user/user.repositories';

export const getUserStreakService = async (userId: string) => {
  try {
    const userPosts = await getUserStreakRepository(userId);

    if (!userPosts.length) {
      return { 
        userId, 
        currentStreak: 0, 
        totalChallengesParticipated: 0,
        message: 'User has no challenge participation'
      };
    }
    // Hitung streak berdasarkan posts yang ada
    let streak = 0;
    const now = new Date();

    for (let i = 0; i < userPosts.length; i++) {
      const weeksAgo = Math.floor(
        (now.getTime() - new Date(userPosts[i].challenge.timestamp).getTime()) 
        / (7 * 24 * 60 * 60 * 1000)
      );
      
      if (weeksAgo === i) streak++;
      else break;
    }

    return {
      userId,
      currentStreak: streak,
      totalChallengesParticipated: userPosts.length,
      message: `User has a ${streak}-week streak`
    };
  } catch (error) {
    throw new Error('Failed to calculate streak');
  }
};