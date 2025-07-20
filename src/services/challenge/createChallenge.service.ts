import { createChallenge, findChallengeByTimestamp } from '../../repositories/challenge/challenge.repositories'
import { generateChallenge } from './generateChallenge'

export const generateWeeklyChallenge = async () => {
  const now = new Date()

  const monday9am = new Date(now)
  monday9am.setUTCHours(2, 0, 0, 0) // WIB 09:00 = UTC 02:00
  monday9am.setUTCDate(monday9am.getUTCDate() - ((monday9am.getUTCDay() + 6) % 7)) // ke Senin

  const existing = await findChallengeByTimestamp(monday9am)
  if (existing) {
    return { created: false, message: 'Challenge minggu ini sudah ada' }
  }

  const content = await generateChallenge() ?? ''

  const challenge = await createChallenge(content, monday9am)

  return { created: true, challenge: challenge }
}