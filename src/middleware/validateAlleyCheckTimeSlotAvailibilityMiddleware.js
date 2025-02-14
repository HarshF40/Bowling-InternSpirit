import prisma from '../prismaClient.js'

const timeSlotMiddleware = async (req, res, next) => {
	const {startTime, endTime, alleyId} = req.body;
	try {
		const isAlley = await prisma.bowlingAlley.findUnique({
			where : { id: alleyId }
		});
		if(!isAlley) return res.status(404).json({message : "Alley not found:" });
		const timeslots = await prisma.timeSlot.findMany({
			where : { alleyId },
			select : {
				startTime : true,
				endTime : true
			}
		});
		for(let slot of timeslots){
			if((startTime < slot.endTime && startTime > slot.startTime) || (endTime < slot.endTime && endTime > slot.startTime) || startTime == slot.startTime || endTime == slot.endTime)
				return res.status(404).json({message : "No slot found, try another slot"});
		}
		next();
	} catch(err) {
		console.log(err);
		return res.status(404).json({message : "Enter Valid details"});
	}
}

export default timeSlotMiddleware
