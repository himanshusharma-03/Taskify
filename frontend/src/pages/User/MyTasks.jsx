import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskListTable from "../../components/layouts/TaskListTable";
import TaskCard from "../../components/Cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async (status) => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: { status: status === "All" ? undefined : status },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

 

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
            
        

          {tabs.length > 0 && (
           
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            
            
          )}
        </div>

        {allTasks.length > 0 ? (
          <>
            <TaskListTable tableData={allTasks} onClickTask={handleClick} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {allTasks.map((item) => (
                <TaskCard
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item._id)}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">No tasks found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
