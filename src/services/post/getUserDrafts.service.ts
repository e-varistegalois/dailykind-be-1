import { getUserDraftsRepository } from '../../repositories/post/post.repositories';

export const getUserDraftsService = async (userId: string) => {
  try {
    const drafts = await getUserDraftsRepository(userId);
    
    const transformedDrafts = drafts.map(draft => ({
      id: draft.id,
      challengeId: draft.challengeId,
      userId: draft.userId,
      content: draft.content,
      imageUrl: draft.imageUrl,
      status: draft.status,
      createdAt: draft.createdAt,
      challenge: {
        content: draft.challenge.content,
        timestamp: draft.challenge.timestamp,
        isActive: draft.challenge.isActive
      }
    }));

    return {
      drafts: transformedDrafts,
      count: transformedDrafts.length,
      message: transformedDrafts.length > 0 
        ? `Found ${transformedDrafts.length} draft(s)` 
        : 'No drafts found'
    };
  } catch (error) {
    console.error('Error getting user drafts:', error);
    throw new Error('Failed to get user drafts');
  }
};