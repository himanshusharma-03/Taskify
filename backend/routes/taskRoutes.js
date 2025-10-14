const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const taskController = require("../controllers/taskController");

const router = express.Router();

// //Task Management Routes
router.get("/dashboard-data", protect, taskController.getDashboardData); 
router.get("/user-dashboard-data", protect, 
    taskController.getUserDashboardData);
router.get("/",protect,taskController.getTasks); //Get all tasks (Admin: all, User:assigned)
 router.get("/:id",protect, taskController.getTaskById);//Get task by ID
router.post("/",protect, adminOnly, taskController.createTask); // Create a task (Admin Only)
router.put("/:id",protect, taskController.updateTask); //Update task details
 router.delete("/:id",protect,adminOnly,taskController.deleteTask);// delete a task(Admin only)
router.put("/:id/status", protect,taskController.updateTaskStatus);//Update task status
 router.put("/:id/todo",protect,taskController.updateTaskChecklist);//update task checklist

module.exports = router;
