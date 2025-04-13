import express from 'express';
import mongoose from 'mongoose';
import {Port,mongoUrl } from "./config.js";
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoute.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cookieParser()); 
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
   
 
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));
  
 
    