import { PrismaClientRustPanicError } from '@prisma/client/runtime/library.js';
import prisma from '../prismaClient.js';
import express from 'express';

const router = express.Router();

router.post('/requests', async (req, res) => {
	const { alleyId } = req.body;
	console.log(req.body)
	try {
		const slotReq = await prisma.reservation.findMany({
			where : {
				alleyId : alleyId,
				reservationStatus : "PENDING"
			}
		});
		res.send(slotReq);
	} catch(err) {
		console.log(err);
		return res.send(404).json({message : "Enter valid details"});
	}
})

router.post('/approve', async (req, res) => {
	const { resId } = req.body;
	try {
		const approve = await prisma.reservation.update({
			where : {
				id : resId
			}, 
			data : {
				reservationStatus : "APPROVED"
			}
		})
		console.log("Approved")

		const lockTimeSlot = await prisma.timeSlot.update({
			where : {
				id : approve.timeSlotId
			},
			data : {
				status : "UNAVAILABLE"
			}
		})

		res.send([approve, lockTimeSlot])
	} catch(err) {
		console.log(err)
		res.send(404).json({ message : "Enter valid id number"})
	}
})

router.post('/reject', async (req, res) => {
	const { resId } = req.body
	try {
		const reject = await prisma.reservation.update({
			where : {
				id : resId
			}, 
			data : {
				reservationStatus : "REJECTED"
			}
		})
		console.log("REJECTED")
		res.send(reject);
	} catch(err) {
		console.log(err)
		res.send(404).json({ message : "Enter valid id number"})
	}
})

export default router;
