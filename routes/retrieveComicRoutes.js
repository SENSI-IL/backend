import express from 'express';
import { getComicData } from '../controllers/retrieveComicController.js';

const router = express.Router();

router.post('/retrieve', getComicData); 

export default router;
