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

router.get('/list', async (req, res) => {
	try {
		const alleys = await prisma.bowlingAlley.findMany();
		res.json(alleys);
	} catch(err) {
		return res.send(404).json({message : "No alleys found"});
	}
})

export default router;
