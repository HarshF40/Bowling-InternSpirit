import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router();

router.post('/request', async (res, req) => {
	//account id from the middleware
	//starttime and endtime will be checked by a regex in the front end as it a string
	{ startTime, endTime, alleyId, playerCount, contactInfo } = req
})
