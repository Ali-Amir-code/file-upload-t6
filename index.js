import { config } from 'dotenv';
config();

import express, {json} from 'express';
import  connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import downloadRoutes from './routes/download.js';
import fileRoutes from './routes/file.js';
import deleteRoutes from './routes/delete.js'

const app = express();

connectDB();

app.use(json());

app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/', fileRoutes);
app.use('/download', downloadRoutes);
app.use('/delete', deleteRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to File Upload API'});
});

app.listen(process.env.PORT || 5000, ()=> {
    console.log("Server is running...");
})
