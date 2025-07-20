import { findChallengeById } from "../../repositories/challenge/challenge.repositories";

export const getChallengeByIdService = async (challengeId: string) => {
  if (!challengeId) {
    throw new Error('Error: challengeId is required');
  }

  const challenge = await findChallengeById(challengeId);

  return { challenge };
};