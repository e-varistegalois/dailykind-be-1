import { findChallengeByTimeRange } from '../../repositories/challenge/challenge.repositories';

export const getChallengeByTimeRangeService = async (start: Date, end: Date) => {
  if (!start || !end) {
    throw { status: 400, message: 'start and end date are required' };
  }

  const challenge = await findChallengeByTimeRange(start, end);

  if (!challenge) {
    throw { status: 404, message: 'Challenge not found in the given time range' };
  }

  return challenge;
};