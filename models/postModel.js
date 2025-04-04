const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title:{
        type: String,
        required:[true, 'title is required!'],
        trim:true,
    },
    description:{
        type: String,
        required:[true, 'description is required!'],
        trim:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,  // Stores the unique ObjectId of a User document (used for referencing a user). (when same user create a deferent posts, this userId going same )
        ref: 'User',  // Creates a reference to the User model
        required:true,
    }

},{timestamps:true})

module.exports = mongoose.model('Post', postSchema)