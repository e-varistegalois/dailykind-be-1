import { Request, Response } from 'express'
import { generateWeeklyChallenge } from '../../services/challenge/createChallenge.service'
import { getActiveChallengeService } from '../../services/challenge/getWeeklyChallenge.service'

export const handleGenerateWeeklyChallenge = async (req: Request, res: Response) => {
  try {
    const result = await generateWeeklyChallenge()
    res.status(result.created ? 201 : 200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Gagal membuat challenge mingguan' })
  }
}

export const handleGetWeeklyChallenge = async (req: Request, res: Response) => {
  try {
    const result = await getActiveChallengeService()
    
    if (!result.challenge) {
      return res.status(404).json({ 
        message: 'No active weekly challenge found',
        challenge: null 
      })
    }
    
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Gagal mengambil challenge mingguan' })
  }
}