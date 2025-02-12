import express from "express";
import authRoutes from './routes/authRoutes.js'
import alleyRoutes from './routes/alleyRoutes.js'
import roleMiddleware from './middleware/roleMiddleware.js' 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
	res.sendStatus(200);
})

app.use('/auth', authRoutes);
app.use('/alley', roleMiddleware, alleyRoutes);

app.listen(PORT, () => {
	console.log(`Server: Running on PORT ${PORT}`);
})
