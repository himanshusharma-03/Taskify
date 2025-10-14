const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

//Generate JWT Token
const generateToken = (userId) =>{
    return jwt.sign({id: userId},process.env.JWT_SECRET,{ expiresIn: "7d"});
};
//@desc  register a new user
//@route POST/API/auth/register
//@access public
const registerUser = async(req, res)=>{
    try{
        const { name, email, password,profileTmageUrl,adminInviteToken ,role}=req.body;

        //check if user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "user already exists"});
        }

        //Determine user role: Admin if correct token is provided, otherwise Member

        // let role = "member";
        // if(
        //     adminInviteToken && 
        //     adminInviteToken == process.env.ADMIN_INVITE_TOKEN
        // ){
        //     role = "admin";
        // }


        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //create new  user
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            profileTmageUrl,
            role,
        });

        //retunn user data with JWT 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role : user.role,
            profileImageUrl : user.profileImageUrl,
            token : generateToken(user._id),

        })
    }catch(error){
        res.status(500).json({message: "Server error", error:error.message});

    }
};
//desc Login user
//@route POST/API/auth/profile
//@acess Private (Requires Jwt)
const loginUser = async(req,res) => {

    try{
        const  {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }
        // Compare password 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "invalid email or password"});
        }

        //Return user data with JWT
        res.json({
            _id : user._id,
            name: user.name,
            emai : user.email,
            role: user.role,
            profileImageUrl : user.profileImageUrl,
            token: generateToken(user._id),


        });





    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }

};

//@desc Update user profile
//@route PUT/api/auth/profile
//@access Private(Requires JWT)

const getUserProfile = async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message: "user not found"});
        }
        res.json(user);



    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }

};

//@desc Update user profile
//@route PUT/api/auth/profile
//@acess private(Requires Jwt)
const updateUserProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();

        res.json({
            _id: updateUserProfile._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            token: generateToken(updateUser._id),
        })

    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }

};


module.exports = {registerUser, loginUser, getUserProfile,updateUserProfile}; 

