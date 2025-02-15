import prisma from '../prismaClient.js';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
	const { alleyId } = req.body;
	try {
		const slots = await prisma.timeSlot.findMany({
			where : {
				alleyId,
				status : "UNAVAILABLE"
			}
		});
		if(slots.length === 0) throw new Error("Alley not found")
		return res.send(slots);
	} catch(err) { return res.status(404).json({message : `${err.message}`}); }
})

export default router
