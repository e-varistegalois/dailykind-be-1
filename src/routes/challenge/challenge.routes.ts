// routes/challengeRoutes.ts
import { Router } from 'express'
import { handleGenerateWeeklyChallenge } from '../../controller/challenge/challenge.controller'

const router = Router()

router.get('/', handleGenerateWeeklyChallenge)

export default router
