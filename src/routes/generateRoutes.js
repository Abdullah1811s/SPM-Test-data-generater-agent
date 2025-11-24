import express from 'express';
import { generateTestData } from '../controllers/generateController.js';

const router = express.Router();


router.get('/', (req, res) => res.json({ status: 'Backend is running!' }))

router.get('/health', (req, res) => res.json({ status: '67 🤷 Test Data Agent is alive and running !' }));


router.post('/generate', generateTestData);

export default router;
