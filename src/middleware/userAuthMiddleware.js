import jwt from "jsonwebtoken";

const userAuthMiddleware = (req, res, next) => {
	console.log("in user auth")
	const token = req.headers['authorization'];
	if(!token) {
		return res.status(401).json({
			message : "No token provided"
		});
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
		if(err) {return res.status(401).json({message: "Invalid Token"})}
		req.id = decode.id //this id will be used later to get the user details
		console.log("User Authenticated");
		next();
	})
}

export default userAuthMiddleware;
