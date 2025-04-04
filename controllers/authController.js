const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const { signupSchema, signinSchema } = require("../middlewares/validator");
const { doHash, doHashValidation } = require('../utils/hashing');

exports.signup = async (req, res) => {
    // res.json({message: 'Signup Success'})
    const {email,password} = req.body;   // Extract email and password from request body
    try {
        const {error, value} = signupSchema.validate({email,password});

        if(error){
            return res.status(401).json({successs:false, message: error.details[0].message})
        }
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(401).json({success:false, message:"User already exsists!"})
        }

        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password:hashedPassword,
        })
        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success:true,
            message:"Your account has been created successfully",
            result,
        })
    } catch (error) {
        console.log(error)
    }
};

exports.signin= async (req,res) =>{
    const {email, password} = req.body;
    try {
        const {error, value} = signinSchema.validate({email, password});
        if (error){
            return res
                .status(401)
                .json({success: false, message: error.details[0].message }) // Validation error in email or password
        }
        const existingUser = await User.findOne({email}).select('+password');

        if(!existingUser){
            return res
                .status(401)
                .json({success: false, message: 'User does not exsists!'});
        }
        const result = await doHashValidation(password, existingUser.password);

        if(!result){
            return res
            .status(401)
            .json({success: false, message: 'Invalid credentials!'});
        }
        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '8h',
        }
        );

        res.cookie('Authorization', 'Bearer' + token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        }).json({
            success: true,
            token,
            message: 'logged in successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error!" });
    }
};

exports.signout=async (req,res) =>{
    res
        .clearCookie('Athorization')
        .status(200)
        .json({success: true, message: 'Logged out successfully'});
};

exports.sendVerificationCode = async (req,res) => {
    const {email} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res
                .status(404)
                .json({success: false, message: 'User does not exsists!' });
        }
        if(existingUser.verified) {
            return res
                .status(400)
                .json({success: false, message: "Youa re already verified!"})
        }
    } catch (error) {
        
    }
}