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

router.delete('/delete/:resId', async (req, res) => {
	const resId = parseInt(req.params.resId);
	console.log(resId);
	try {
		const reservationSlot = await prisma.reservation.findUnique({ where : {id : resId}});
		if(!reservationSlot) throw new Error("No reservation found");
		const timeSlotId = reservationSlot.timeSlotId;
		const timeSlot = await prisma.timeSlot.findUnique({ where : {id : timeSlotId}}) ;
		if(!timeSlot) throw new Error("No timeslot found");
		await prisma.reservation.delete({ where : {id : resId}});
		await prisma.timeSlot.delete({ where : {id : timeSlotId}});
		res.json({message : "Reservation Successfully Removed"});
	} catch(err) {
		return res.status(404).json({message : `${err.message}`})
	}
})

router.get('/reservation/:alleyId', async (req, res) => {
	const alleyId = parseInt(req.params.alleyId);
	try {
		const resv = await prisma.reservation.findMany({ where : {alleyId}});
		if(resv.length === 0) throw new Error("No reservation or alley found, check again if alley exists");
		res.send(resv);
	} catch(err) {
		res.status(404).json({message : `${err.message}`});
	}
})

export default router;
