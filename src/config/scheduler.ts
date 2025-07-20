import cron from 'node-cron'
import { createWeeklyChallenge } from '../../services/challenge/createShallenge.service'


// Cron: Senin pukul 09:00 WIB (WIB = UTC+7 → 02:00 UTC)
cron.schedule('0 2 * * 1', async () => {
  console.log('⏰ Menjalankan scheduler weekly challenge...')
  await createWeeklyChallenge()
})
