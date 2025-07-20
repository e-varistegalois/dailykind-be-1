// routes/challengeRoutes.ts
import { Router } from 'express'
import { handleGetWeeklyChallenge } from '../../controller/challenge/challenge.controller'

const router = Router()

router.get('/', handleGetWeeklyChallenge)

export default router
