import prisma from '../prismaClient.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
	const { alleyId } = req.body;
	try {
		const slots = await prisma.timeSlot.findMany({
			where : {
				alleyId,
				status : "UNAVAILABLE"
			}
		});
		res.send(slots);
	} catch(err) {
		console.log(err)
		res.send(404).json({message : "Enter Valid details"});
	}
})

export default router
