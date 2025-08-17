const Task = require("../models/task");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

//@desc   Get all users(Admin Only)
//@route   GET/api/users/
//@access  Private(Admin)
const getUsers = async(req, res)=>{
    try{
        const users = await User.find({role: 'member'}).select ("-password");

        //ADD task counts to each user
        const userWithTaskCounts = await Promise.all(users.map(async(user)=>{
            cons
        })) 

    }catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};
//@desc Get user By id
//@route Get/api/user/:id
//@access Private

const getUserById = async(req, res) =>{
    try{

    }catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }};
//@desc Delete a user (Admin Only)
//@route DELETE /api/user/:id
//@access  Private(Admin)

const deleteUser = async(req,res)=> {
    try{

    }catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};

module.exports = {getUsers, getUserById, deleteUser};

