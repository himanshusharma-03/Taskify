
import './App.css'
import{
  BrowserRouter as Router,
  Routes,
  Route,
  
}from "react-router-dom";
import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"
import PrivateRoute from './routes/PrivateRoute';
import UserDashboard from './pages/User/UserDasboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTasks';
import ManageUsers from './pages/Admin/ManageUsers'
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import Dashboard from './pages/Admin/Dashboard';
function App() {
 
  return (
   <div>
    <Router>
      <Routes>
        <Route path = "/login" element={<Login />}/>
        <Route path ="/signUp" element ={<SignUp/>}></Route>
        {/*Admin Routes*/}
        <Route element ={<PrivateRoute allowedRoles={["admin"]}></PrivateRoute>}></Route>
        <Route path ="/admin/dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route path ="/admin/tasks" element={<ManageTasks></ManageTasks>}></Route>
        <Route path ="/admin/create-task" element={<CreateTask></CreateTask>}></Route>
        
        <Route path ="/admin/users" element={<ManageUsers></ManageUsers>}></Route>

        {/*User Routes*/}
        <Route element ={<PrivateRoute allowedRoles={["admin"]}></PrivateRoute>}></Route>
        <Route path ="/user/dashboard" element={<UserDashboard></UserDashboard>}></Route>
        <Route path ="/user/tasks" element={<MyTasks></MyTasks>}></Route>
        <Route path ="/user/task-details " element={<ViewTaskDetails></ViewTaskDetails>}></Route>
        
        <Route path ="/users" element={<ManageUsers></ManageUsers>}></Route>
      </Routes>
    </Router>
   </div> 
  )
}

export default App
