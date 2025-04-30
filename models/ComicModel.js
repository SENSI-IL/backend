import mongoose from 'mongoose';

const comicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genres: { type: [String], required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },
    pages: { type: [String], required: true },  
}, { timestamps: true });

const Comic = mongoose.models.Comic || mongoose.model('Comic', comicSchema);

export default Comic;
