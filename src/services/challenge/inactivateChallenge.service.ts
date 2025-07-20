import { inactivateChallenge } from "../../repositories/challenge/challenge.repositories";

export const inactivateChallengeService = async (challengeId: string) => {
  if (!challengeId) {
    const error = new Error("challengeId is required");
    (error as any).status = 400;
    throw error;
  }

  const result = await inactivateChallenge(challengeId);

  return result;
};