import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^(\+251)?9\d{8}$/, 'Phone number must be a valid Ethiopian number'],
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    acceptedTerms: { type: Boolean, required: true, default: false },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
