import express from 'express';
import cors from 'cors';
import { logError, requestLogger } from './utils/logger';
import documentRoutes from './routes/documentRoutes';
import { logInfo } from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/documents', documentRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logError('Unhandled error', undefined, err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logInfo(`Server running on port ${PORT}`);
});
