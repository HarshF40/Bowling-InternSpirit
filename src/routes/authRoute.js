import { Router } from "express"; //Router is used to create modular and mountable route handlers
import {create_user} from "../controllers/auth.js"

const router = Router();
router.post("/", create_user);
export default router;
