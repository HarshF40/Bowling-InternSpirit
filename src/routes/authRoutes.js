import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../prismaClient.js";
import isEmail from "validator/lib/isEmail.js";
import validator from "validator";
const { isMobilePhone } = validator;

dotenv.config();
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, phone, username, password, role } = req.body;
    if (!email || !phone || !username || !password || !role ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    if (!isEmail(email) || !isMobilePhone(phone)) {
        return res.status(400).json({
            message: "Enter valid credentials"
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    try {
        const user = await prisma.account.create({
            data: {
                email,
                phone,
                username,
                passwordHash: hashedPassword,
		role : role
            }
        });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log("User successfully created", user);
        res.json({ token });
    } catch (err) {
        console.log(err.message);
        return res.status(503).json({
		message : "Already in use"
	});
    }
});

router.post('/login', async (req, res) => {
	const {username, password} = req.body;
	try {
		const user = await prisma.account.findUnique({
			where : {
				username : username
			}
		});
		if(!user) {
			return res.send(404).json({
				message : "user not found"
			});
		}
		const passwordValid = bcrypt.compareSync(password, user.passwordHash);
		if(!passwordValid) {
			return res.send(401).json({
				message : "Invalid Password"
			})
		}
		const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn : '24h'});
		console.log("Login Successful")
		res.json({token});
    } catch(err) {
	    console.error(err.message);
	    res.sendStatus(503);
    }
})

export default router;

