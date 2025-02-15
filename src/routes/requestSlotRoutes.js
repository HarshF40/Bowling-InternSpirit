import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router();

router.post('/', async (req, res) => {
	const {startTime, endTime, alleyId, playerCount, contactInfo, date} = req.body;
	const { id } = req;
	try {
		const newTimeSlot = await prisma.timeSlot.create({
			data : {
				startTime,
				endTime,
				date,
				alleyId
			}
		});
		const newReservation = await prisma.reservation.create({
			data : {
				accountId : id,
				timeSlotId : newTimeSlot.id,
				playerCount,
				contactInfo,
				alleyId
			}
		});
		res.status(200).json(newReservation)
	} catch(err) {
		console.log(err);
		return res.status(400).json({message : "Couldnt reserve a slot, try again"})
	}
})

export default router
