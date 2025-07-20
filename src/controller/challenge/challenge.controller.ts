import { Request, Response } from 'express'
import { generateWeeklyChallenge } from '../../services/challenge/createChallenge.service'

export const handleGenerateWeeklyChallenge = async (req: Request, res: Response) => {
  try {
    const result = await generateWeeklyChallenge()
    res.status(result.created ? 201 : 200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Gagal membuat challenge mingguan' })
  }
}