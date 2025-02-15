import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router();

router.post('/', async (req, res) => {
	console.log(req.body)
	const {startTime, endTime, alleyId, playerCount, contactInfo, date} = req.body;
	const { id } = req;
	console.log(id)
	try {
		const newTimeSlot = await prisma.timeSlot.create({
			data : {
				startTime,
				endTime,
				date,
				alleyId
			}
		});
		console.log(newTimeSlot);
		const newReservation = await prisma.reservation.create({
			data : {
				accountId : id,
				timeSlotId : newTimeSlot.id,
				playerCount,
				contactInfo,
				alleyId
			}
		});
		console.log(newReservation);
		res.status(200).json(newReservation)
	} catch(err) {
		console.log(err);
		return res.status(400).json({message : "Couldnt reserve a slot, try again"})
	}
})

export default router
