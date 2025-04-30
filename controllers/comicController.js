import Comic from '../models/ComicModel.js';


  export const comic = async (req, res) => {
    try {
        const { title, genres, rating, description, pages } = req.body;
        const image = req.file ? req.file.filename : null;
        const imageUrl = image ? `${req.protocol}://${req.get('host')}/uploads/${image}` : null;

        const newComic = new Comic({
            title,
            genres,
            rating,
            image: imageUrl,
            description,
            pages,
        });

        await newComic.save();
        res.status(201).json(newComic);
    } catch (error) {
        res.status(400).json({ message: 'Error creating comic', error });
    }
};


export const comics = async (req, res) => {
    try {
        const comics = await Comic.find();
        res.status(200).json(comics);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching comics', error });
    }
};

export const comicId = async (req, res) => {
    try {
        const comic = await Comic.findById(req.params.id);
        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }
        res.status(200).json(comic);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching comic', error });
    }
};

export const comicUpdate = async (req, res) => {
    try {
        const { title, genres, rating, description, pages } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const updateData = { title, genres, rating, description, pages };

        if (image) {
            updateData.image = `${req.protocol}://${req.get('host')}/uploads/${image}`;
        }

        const updatedComic = await Comic.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedComic) {
            return res.status(404).json({ message: 'Comic not found' });
        }

        res.status(200).json(updatedComic);
    } catch (error) {
        res.status(400).json({ message: 'Error updating comic', error });
    }
};
 

        

export const comicDelete = async (req, res) => {
    try {
        const deletedComic = await Comic.findByIdAndDelete(req.params.id);
        if (!deletedComic) {
            return res.status(404).json({ message: 'Comic not found' });
        }
        res.status(200).json({ message: 'Comic deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting comic', error });
    }
};
