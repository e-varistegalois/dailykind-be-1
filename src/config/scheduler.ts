import cron from 'node-cron'
import { generateWeeklyChallenge } from '../services/challenge/createChallenge.service'


// Cron: Senin pukul 09:00 WIB (WIB = UTC+7 → 02:00 UTC)
cron.schedule('0 2 * * 1', async () => {
//cron.schedule('38 14 * * 0', async () => {
//cron.schedule('* * * * *', async () => {
  console.log('⏰ Menjalankan scheduler weekly challenge...')
  const result = await generateWeeklyChallenge()
  console.log('⏰ dia berhasil...')
  console.log(result)
})
