import { PrismaClient } from "@prisma/client";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const create_user = async (req, res) => {
	const {email, phone, name, password} = req.body

	if(!(email || phone || name || password))
		return res.status(400),json({error: "All fields are required"})

	if(!validator.isEmail(email))
		return res.status(400).json({error: "Invalid email"})

	if(!validator.isMobilePhone(phone))
		return res.status(400).json({error: "Invalid phone"})

	if(password.length() < 6)
		return res.status().json({error: ""})
}
