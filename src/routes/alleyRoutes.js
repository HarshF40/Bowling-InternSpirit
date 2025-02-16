import express from "express";
import prisma from "../prismaClient.js"

const router = express.Router();

router.post('/new', async (req, res) => {
	const alley = await prisma.bowlingAlley.create({
		data : {
			managerId : req.manId
		}
	})
	res.json(alley);
})

router.get('/list', async (_, res) => {
	try {
		const alleys = await prisma.bowlingAlley.findMany();
		res.json(alleys);
	} catch(err) {
		return res.send(404).json({message : "No alleys found"});
	}
})

router.delete('/delete/:alleyId', async (req, res) => {
	const id = parseInt(req.params.alleyId);
	try {
		const alley = await prisma.bowlingAlley.findUnique({ where : {id}});
		if(!alley) throw new Error("Alley Not Found");
		const checkTimeSlot = await prisma.timeSlot.findMany({where : {alleyId : id}});
		if(checkTimeSlot.length !== 0) throw new Error("Remove the TimeSlots before deleting the alleys");
		await prisma.bowlingAlley.delete({ where : {id}});
		res.json({message : "Alley Deleted Successfully"});
	} catch(err) {
		res.status(404).json({message : `${err.message}`});
	}
})

export default router;
