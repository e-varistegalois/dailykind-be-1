import cron from 'node-cron'
import { generateWeeklyChallenge } from '../services/challenge/createChallenge.service'
import { deactivateLastWeeksChallengeService } from '../services/challenge/deactivateLastWeeksChallenge.service'


// Cron: Senin pukul 09:00 WIB (WIB = UTC+7 → 02:00 UTC)
cron.schedule('0 2 * * 1', async () => {
  console.log('⏰ Menjalankan scheduler weekly challenge...')
  const result = await generateWeeklyChallenge()
  const deactivatedLastWeeksChallenge = await deactivateLastWeeksChallengeService()
  console.log('⏰ dia berhasil...')
  console.log(result)
  console.log()
  console.log('⏰ deactivated last week challenge:', deactivatedLastWeeksChallenge)
})
