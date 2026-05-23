import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/initDb.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import dentistRoutes from './routes/dentistRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import refreshTokenModel from './models/refreshTokenModel.js';

dotenv.config();

initializeDatabase();
refreshTokenModel.deleteExpired();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dentists', dentistRoutes);
app.use('/api/treatments', treatmentRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use.\n` +
        `  • Stop the other process: lsof -i :${PORT}   then   kill <PID>\n` +
        `  • Or change PORT in backend/.env (e.g. 3002)\n`
    );
    process.exit(1);
  }
  throw err;
});
