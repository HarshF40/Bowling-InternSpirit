import prisma from '../prismaClient.js'

const timeSlotMiddleware = async (req, res, next) => {
	console.log(req.body)
	const {startTime, endTime, alleyId, date} = req.body;
	try {
		const isAlley = await prisma.bowlingAlley.findUnique({
			where : { id: alleyId }
		});
		if(!isAlley) return res.status(404).json({message : "Alley not found:" });
		const timeslots = await prisma.timeSlot.findMany({
			where : { alleyId },
			select : {
				startTime : true,
				endTime : true,
				date: true,
			}
		});
		console.log(timeslots)
		for(let slot of timeslots){
		console.log(slot.date, date)
			if((startTime < slot.endTime && startTime > slot.startTime) || (endTime < slot.endTime && endTime > slot.startTime) || ((startTime < slot.startTime) && (endTime > slot.endTime)) || startTime == slot.startTime || endTime == slot.endTime){
				if(date == slot.date)
					return res.status(404).json({message : "No slot found, try another slot"});
			}
		}
		next();
	} catch(err) {
		console.log(err);
		return res.status(404).json({message : "Enter Valid details"});
	}
}

export default timeSlotMiddleware
