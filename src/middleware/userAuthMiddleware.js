import jwt from "jsonwebtoken";

const userAuthMiddleware = (req, res, next) => {
	const token = req.headers['authorization'];
	if(!token) {
		return res.status(401).json({
			message : "No token provided"
		});
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
		if(err) {return res.status(401).json({message: "Invalid Token"})}
		req.id = decode.id 
		next();
	})
}

export default userAuthMiddleware;
