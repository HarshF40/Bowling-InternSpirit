import prisma from '../prismaClient.js'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

const roleMiddleware = async (req, res, next) => {
	try {
		const token = req.headers['authorization']
		if(!token) {
			return res.status(401).json({
				message: "No token Provided"
			});
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const uid = decoded.id;
		const user = await prisma.account.findUnique({
			where : {
				id: uid
			},
			select : {
				role : true
			}

		});
		if(!user || !user.role == 'MANAGER') {
			return res.status(403).json({
				message : "access denied"
			});
		}
		//req.body = decoded;
		console.log("Authorisation Complete")
		next();
	} catch(err) {
		console.log(err);
		return res.status(401).json({
			message : "unauthorised"
		});
	}
}

export default roleMiddleware
