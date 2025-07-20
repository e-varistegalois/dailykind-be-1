// routes/challengeRoutes.ts
import { Router } from 'express'
import { handleGenerateWeeklyChallenge } from '../../controller/challenge/challenge.controller'

const router = Router()

router.post('/', handleGenerateWeeklyChallenge)

export default router
