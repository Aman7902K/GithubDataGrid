import Router from "express"
import { getRepoData, setRepoData, deleteRepoData } from "../controllers/repos.controller.js";

const router = Router();

router.get("/", getRepoData );

router.post("/", setRepoData)

router.delete("/", deleteRepoData)

export default router;