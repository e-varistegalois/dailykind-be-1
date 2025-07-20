import { getActiveChallengeRepository } from '../../repositories/challenge/challenge.repositories'

export const getActiveChallengeService = async () => {
  try {
    const activeChallenge = await getActiveChallengeRepository()

    return {
      challenge: activeChallenge,
      message: activeChallenge 
        ? 'Active weekly challenge found' 
        : 'No active weekly challenge'
    }
  } catch (error) {
    console.error('Error getting active challenge:', error)
    throw new Error('Failed to get active challenge')
  }
}