import express, { Router } from 'express';
import { documentController } from '../controllers/documentController';

const router: Router = express.Router();

// Route to request presigned URLs for upload
router.post('/request-upload', (req, res) => documentController.requestUpload(req, res));

// Route to confirm upload completion
router.post('/confirm-upload', (req, res) => documentController.confirmUpload(req, res));

// Route to get documents for a user
router.get('/', (req, res) => documentController.getDocuments(req, res));

export default router;
