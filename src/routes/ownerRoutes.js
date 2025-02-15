import prisma from '../prismaClient.js';
import express from 'express';

const router = express.Router();

router.post('/requests', async (req, res) => {
	const { alleyId } = req.body;
	try {
		const slotReq = await prisma.reservation.findMany({
			where : {
				alleyId : alleyId,
				reservationStatus : "PENDING"
			}
		});
		if(slotReq.length === 0)
			throw new Error("Alley Not Found");
		res.send(slotReq);
	} catch(err) {
		return res.json({message : `${err.message}`});
	}
})

router.post('/approve', async (req, res) => {
	const { resId } = req.body;
	try {
		const existingReservation = await prisma.reservation.findUnique({ where : {id : resId}});
		if(!existingReservation) throw new Error("No Reservation application found");
		const approve = await prisma.reservation.update({
			where : {id : resId},
			data : {reservationStatus : "APPROVED"}
		});
		if(!approve.timeSlotId) throw new Error("No timeSlot id assigned");
		const lockTimeSlot = await prisma.timeSlot.update({
			where : {id : approve.timeSlotId},
			data : {status : "UNAVAILABLE"}
		})
		return res.json([approve, lockTimeSlot]);
	} catch(err) {
		return res.status(404).json({ message : `${err.message}`})
	}
})

router.post('/reject', async (req, res) => {
	const { resId } = req.body
	try {
		const existingReservation = await prisma.reservation.findUnique({ where : {id : resId}});
		if(!existingReservation) throw new Error("No Reservation application found")
		const reject = await prisma.reservation.update({
			where : { id : resId }, 
			data : { reservationStatus : "REJECTED" }
		});
		return res.json(reject);
	} catch(err) {
		res.status(404).json({ message : `${err.message}`})
	}
})

export default router;
