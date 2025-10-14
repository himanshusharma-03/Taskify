import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/Selectusers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import Modal from "../../components/Modal";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import DeleteAlert from "../../components/DeleteAlert";
import moment from "moment";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskID } = location.state || {};

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // ✅ Create Task
  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task created successfully!");
      clearData();
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error creating task!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Task
  const updateTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find(
          (task) => task.text === item
        );
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const updatedTaskPayload = {
        ...taskData,
        todoChecklist: todoList,
      };

      const response = await axiosInstance.put(
        `${API_PATHS.TASKS.UPDATE_TASK}/${currentTask._id}`,
        updatedTaskPayload
      );

      if (response.data?.success) {
        toast.success("Task updated successfully!");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskID));
      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  // ✅ Handle Submit
  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!taskData.dueDate) {
      setError("Due Date is required.");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Task is not assigned to any member.");
      return;
    }

    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo task.");
      return;
    }

    if (taskID) {
      updateTask();
    } else {
      createTask();
    }
  };

  // ✅ Get Task Details by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskID)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo.assignedTo?.map((item) => item._id) || [],
          todoChecklist: taskInfo.todoChecklist?.map((item) => item.text) || [],
          attachments: taskInfo.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  useEffect(() => {
    if (taskID) getTaskDetailsByID();
  }, [taskID]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskID ? "Update Task" : "Create Task"}
              </h2>

              {taskID && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            {/* Title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            {/* Description */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            {/* Priority & Due Date Section */}
              <div className="grid grid-cols-12 gap-4 mt-4">
                {/* Priority */}
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Priority
                  </label>
                  <div className="relative z-20"> {/* ✅ Ensures dropdown stays on top */}
                    <SelectDropdown
                      options={PRIORITY_DATA}
                      value={taskData.priority}
                      onChange={({ value }) => handleValueChange("priority", value)}
                      placeholder="Select Priority"
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="form-input w-full"
                    value={taskData.dueDate || ""}
                    onChange={({ target }) => handleValueChange("dueDate", target.value)}
                  />
                </div>
              </div>


            {/* Assign To */}
            <div className="col-span-12 md:col-span-3 mt-3">
              <label className="text-xs font-medium text-slate-600">
                Assign To
              </label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) =>
                  handleValueChange("assignedTo", value)
                }
              />
            </div>

            {/* Todo List */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            {/* Attachments */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-7">
              <button
                className={`add-btn ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : taskID
                  ? "UPDATE TASK"
                  : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure want to delete this task?"
          openDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
