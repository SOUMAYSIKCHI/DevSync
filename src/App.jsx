// App.js
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Unkown from "./LandingPages/Unkown";
import Layout from "./Pages/Layout";
import Home from "./LandingPages/Home";
import EditProfile from "./Pages/EditProfile";
import Connections from "./Pages/Connections";
import Message from "./Pages/Message";
import JobPage from "./Pages/JobPage";
import JobUpdate from "./adminPages/JobUpdate";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/v1"
        element={
          <ProtectedRoute>
            <Layout/>
          </ProtectedRoute>
        }
      > 
        <Route index element={<Dashboard />} />
        <Route path="editProfile" element={<EditProfile/>}/>
        <Route path="connections" element={<Connections/>}/>
        <Route path="chat/:targetUserId" element={<Message/>}/>
        <Route path= "jobs" element={<JobPage/>}/>
        <Route path="admin/jobs" element={<JobUpdate/>} />
      </Route>

      <Route path="*" element={<Unkown />} />
    </Routes>
  );
}

export default App;
