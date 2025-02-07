import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator"

const prisma = new PrismaClient();

export const create_user = async (req, res) => {
	const {email, phone, name, password} = req.body

	if(!email || !phone || !name || !password)
		return res.status(400),json({error: "All fields are required"})

	if(!validator.isEmail(email))
		return res.status(400).json({error: "Invalid email"})

	if(!validator.isMobilePhone(phone))
		return res.status(400).json({error: "Invalid phone"})

	if(password.length < 6)
		return res.status(400).json({error: "Password must be at least 6 characters"});

	const hashedPasword = await bcrypt.hash(password, 10);
	console.log(hashedPasword);

	try{
		const user = await prisma.user.create({
			data: {
				email,
				phone,
				name,
				password: hashedPasword,
			}
		})

		console.log(user)

		return res.status(201).json({message: "User Created successfully"}. user);
	} catch(error){
		console.log(error);
		return res.status(500).json({error: "Internal server error"});
	}
}
