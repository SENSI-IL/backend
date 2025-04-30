import express from 'express';
import mongoose from 'mongoose';
import {Port,mongoUrl } from "./config.js";
import artistRouter from './routes/artistRoutes.js';
import explorerRouter from './routes/explorerRoutes.js';
import retrieveExRouter from './routes/retrieveExplorerRoute.js';
import retrieveArtRouter from './routes/retrieveArtistRoutes.js';
import retrieveComicRouter from './routes/retrieveComicRoutes.js';
import comicRouter from './routes/comicRoutes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cookieParser()); 
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/explorer',explorerRouter);
app.use('/api/artist',artistRouter);
app.use('/api/exretrieve',retrieveExRouter);
app.use('/api/artretrieve',retrieveArtRouter);
app.use('/api/comicretrieve',retrieveComicRouter);
app.use('/api/comic',comicRouter);  
app.use('/uploads', express.static(path.join('uploads')));
 
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));
  
 
 
   