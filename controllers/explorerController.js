import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import explorerModel from '../models/ explorerModel.js';
import nodemailer from 'nodemailer';
import {JWT_SECRET_KEY} from "../config.js"

 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'edenb928@gmail.com', 
    pass: 'wkqq dktj xqqr tvdr',   
  },
});

export const register = async(req,res)=>{
       const {name,password,email} = req.body;

         if (!name || !email || !password) {
           return res.json({success:false, message:"Missing Details"})
         }
         try {
            const existingUser = await explorerModel.findOne({email})
            if (existingUser) {
                return res.json({success:false,message:"User already exists"})
                
            }
            const hashPassword = await bcrypt.hash(password,10)
            const user = new explorerModel({name,email,password:hashPassword })
            await user.save()

            const token =jwt.sign({id:user._id},JWT_SECRET_KEY,{expiresIn :'7d'})
            res.cookie('token',token)
            const mailOptions = {
               from: 'edenb928@gmail.com',          
               to:email,        
               subject: 'Welcome to SmartQueue',     
               text: `Welcome to SmartQueue website.your account has been created with email id:${email}`,  
                 
             } 
             await transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                 return console.log('Error:', error);
               }
               console.log('Email sent:', info.response);
             });
            res.json({success:true})
            
         } catch (error) {
            return res.json({success:false,message:error.message})
         }

}

export const login = async(req,res)=>{
   const {email,password} = req.body;

   if (!email || !password) {
      return res.json({success:false, message:"Email and Password are required"})
   }
   try {

      const user = await explorerModel.findOne({email})
      if (!user) {
        return res.json({success:false,message:'Invalid Email'})
      }
      const isMatch = await bcrypt.compare(password,user.password)
      if (!isMatch) {
         return res.json({success:false,message:"Invalid Password"})
      }
      const token =jwt.sign({id:user._id},JWT_SECRET_KEY,{expiresIn :'7d'})
      res.cookie('token',token)
      res.json({success:true})
      
   } catch (error) {
      return  res.json({success:false,message:error.message})
   }

}

export  const logout = async(req,res)=>{
   try {
      res.clearCookie = ('token')
      return res.json({success:true,message:"Logged Out"})
   } catch (error) {
       return res.json({success:false, message:error.message})
   }
}

export const sendVerifyOtp = async(req,res)=>{

   try {
      const {userId} = req.body;
      const user = await explorerModel.findById(userId)
      if (user.isAccountVerified) {
         return res.json({success:false,message:"Account Already verified"})
      }
      const otp = String(Math.floor(100000 + Math.random()*900000));
       user.verifyOtp = otp;
       user.verifyOtpExpireAt = Date.now() + 24 *60 * 60 * 1000;

       await user.save();
       const mailOptions = {
         from: 'edenb928@gmail.com',          
         to:user.email,        
         subject:'Account Verification OTP',   
         text:`Your OTP is ${otp}.Verify your OTP using this OTP`,  
           
       } 
       await transporter.sendMail(mailOptions)
       res.json({success:true,message:"Verification OTP Sent on Email"})
      
   } catch (error) {
      res.json({success:false,message:error.message})
   }
    
}

export const verifyEmail = async(req,res)=>{
   const {userId,otp} = req.body
   if (!userId || !otp) {
      return res.json({success:false , message:"Missing Details"})
   }
   try {
      const user = await explorerModel.findById(userId)
      if (!user) {
        return  res.json({success:false,message:'User not found'})
      }
      if(user.verifyOtp === '' || user.verifyOtp !== otp){
         return res.json({success:false,message:"Invalid OTP"})
      }
      if (user.verifyOtpExpireAt < Date.now()) {
         return res.json({success:false,message:"OTP Expired"})
      }
      user.isAccountVerified = true;
      user.verifyOtp = '';
      user.verifyOtpExpireAt = 0;

      await user.save();
      return res.json({success:true,message:'Email verified successfully'})
   } catch (error) {
      return res.json({success:false,message:error.message})
   }
}

export const isAuthenticated = async(req,res)=>{
   try {
      return res.json({success:true})
   } catch (error) {
       res.json({success:false,message:error.message})
   }
}

export const sendResetOtp = async(req,res) =>{
   const {email} = req.body;
   if (!email) {
      return res.json({success:false,message:"Email is required"})
   }
   try {
      const user = await explorerModel.findOne({email})
       if (!user) {
         return res.json({success:false,message:"User not found"})
       }

       const otp = String(Math.floor(100000 + Math.random()*900000));
       user.resetOtp = otp;
       user.resetOtpExpireAt = Date.now() + 15 *60 * 60 * 1000;

       await user.save();
       const mailOptions = {
         from: 'edenb928@gmail.com',          
         to:user.email,        
         subject:'Password Reset OTP',   
         text:`Your OTP for resetting your password is ${otp}.use this OTP to proceed wit resetting your password`,  
           
       } 
       await transporter.sendMail(mailOptions)
      return  res.json({success:true,message:"OTP sent to your email"})
      
   } catch (error) {
      return res.json({success:false,message:error.message})
   }
}

export const resetPassword = async(req,res)=>{
   const {email,otp,newPassword} = req.body

   if (!email || !otp || !newPassword) {
      return res.json({success:false,message:"Email,OTP,new password required"})
   }
   try {
      const user = await explorerModel.findOne({email})
       if (!user) {
         return res.json({success:false,message:"User not found"})
       }
       if (user.resetOtp === "" || user.resetOtp !== otp) {
         return res.json({success:false,message:"Invalid OTP"})
       
       }
       if (user.resetOtpExpireAt < Date.now()) {
         return res.json({success:false,message:'OTP Expired'})
       }
       const hashPassword = await bcrypt.hash(newPassword,10)
       user.password = hashPassword;
       user.resetOtp = '';
       user.resetOtpExpireAt = 0

       await user.save();
       return res.json({success:true,message:'Password has been reset Successfully'})
   } catch (error) {
      return res.json({success:false,message:error.message})
   }
}