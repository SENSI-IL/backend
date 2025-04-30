export const getComicData = async (req, res) => {
    try {
        const { comicId } = req.body;
        const comic = await Comic.findById(comicId);

        if (!comic) {
            return res.json({ success: false, message: "Comic not found" });
        }

        res.json({
            success: true,
            comicData: {
                title: comic.title,
                genres: comic.genres,
                rating: comic.rating,
                image: comic.image,
                description: comic.description,
                pages: comic.pages
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
