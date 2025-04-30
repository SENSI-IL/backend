import express from 'express';
import multer from 'multer';
import { comic, comics ,comicUpdate, comicDelete } from "../controllers/comicController.js";

const comicRouter = express.Router();

 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');  
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

 
comicRouter.post('/comics', upload.single('image'), comic);
comicRouter.get('/comics', comics);
comicRouter.put('/comics/:id', upload.single('image'), comicUpdate);  
comicRouter.delete('/comics/:id', comicDelete);

export default comicRouter;
