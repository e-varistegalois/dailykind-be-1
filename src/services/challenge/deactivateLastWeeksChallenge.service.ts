import { deactivateChallengeById, findChallengeByTimeRange } from '../../repositories/challenge/challenge.repositories'

export const deactivateLastWeeksChallengeService = async () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Minggu = 0, Senin = 1, dst
    const daysSinceMonday = (dayOfWeek + 6) % 7; // Senin = 0, Selasa = 1, ..., Minggu = 6
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - daysSinceMonday - 7); // Mundur ke Senin minggu lalu


    const startOfDay = new Date(lastMonday);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(lastMonday);
    endOfDay.setHours(23, 59, 59, 999);
    
    const challenge = await findChallengeByTimeRange(startOfDay, endOfDay);
    
    if (!challenge) {
        throw { status: 404, message: 'Last week\'s challenge not found' };
    }

    const deactivatedChallenge = await deactivateChallengeById(challenge.id);

    if (!deactivatedChallenge) {
        throw { status: 500, message: 'Failed to deactivate challenge' };
    }

    return deactivatedChallenge;
}