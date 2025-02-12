import express from "express";
import prisma from "../prismaClient.js"

const router = express.Router();

router.post('/new', async (req, res) => {
	const alley = await prisma.bowlingAlley.create({
		data : {
			managerId : req.body.id
		}
	})
	res.json(alley);
})

router.get('/list', async (req, res) => {
	const alleys = await prisma.bowlingAlley.findMany();
	console.log(alleys);
	res.json(alleys);
})

export default router;
