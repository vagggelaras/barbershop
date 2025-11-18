import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import closedDaysRoute from './routes/closedDaysRoutes.js';
import personnelRoutes from './routes/personnelRoutes.js'
import servicesRoutes from "./routes/servicesRoutes.js"
import appointmentsRoutes from './routes/appointmentsRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://barbershop-rosy-xi.vercel.app'
        ];

        // Allow all Vercel preview deployments
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/', userRoutes);
app.use('/', closedDaysRoute);
app.use('/', personnelRoutes);
app.use('/', servicesRoutes);
app.use('/', appointmentsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})