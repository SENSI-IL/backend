 import artistModel from "../models/artistModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await artistModel.findById(userId);
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    res.json({
      success: true,
      userData: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        acceptedTerms: user.acceptedTerms,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
