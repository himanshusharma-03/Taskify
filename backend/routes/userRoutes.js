const express = require("express");
const {adminOnly , protect} = require("../middlewares/authMiddleware");

const router = express.Router();

// User Management Routes
router.get("/",protect,adminOnly,getUsers); //Get all users (Admin Only)
router.get("/:id",protect,getUserById);// Get a specific user
router.delete("/:id",protect,adminOnly,deleteUser);//Delete user (Admin only0)

module.exports = router;

