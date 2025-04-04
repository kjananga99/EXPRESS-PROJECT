const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Email is required!'],
        trim: true, // Removes whitespace before and after the string
        unique: [true, 'Email must be unique!'],
        minLength: [5, 'Email must have 5characters!'],
        lowercase: true,
    },
    password:{
        type: String,
        required: [true, 'Password must be provided!'],
        trim: true,
        select: false // This field will not be returned by default
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationCode:{
        type: Number,
        select: false
    },
    forgotPasswordCode:{
        type: String,
        select: false
    },
    forgotPasswordCodeValidation:{
        type: Number,
        select: false
    }
},{
    timestamps:true  // This automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema)