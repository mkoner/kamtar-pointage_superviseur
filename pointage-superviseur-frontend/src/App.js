import React from "react";
import { useState } from "react";
import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/login.page/login.page";
import SignUpPage from "./pages/sign-up.page/sign-up.page";
import MissionPage from "./pages/mission.page/mission.page";
import Footer from "./components/footer/footer.component";
import CreateMission from "./pages/create-mission/create-mission";
import UserList from "./pages/user-liste/user-list";
import UserPage from "./pages/user.page/user.page";
import HomePage from "./pages/home.page/home.page";
import MissionList from "./pages/mission-list.page/mission-list.page";
import Repports from "./pages/repports/repports";
import RepportSup from "./pages/repports-sup/repports-sup";

import "./App.css";
import ManagerListPage from "./pages/manager-list.page/manager-list.page";
import ManagerPage from "./pages/manager.page/manager.page";
import AdminListPage from "./pages/admin-list.page/admin-list.page";
import AdminPage from "./pages/admin.page/admin.page";

const App = () => {
  return (
    <div className="App">
      <div className="elements-container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/missions" element={<MissionList />} />
            <Route path="/missions/:id" element={<MissionPage />} />
            <Route path="/create-mission" element={<CreateMission />} />
            <Route path="/superviseurs" element={<UserList />} />
            <Route path="/superviseurs/:id" element={<UserPage />} />
            <Route path="/managers" element={<ManagerListPage />} />
            <Route path="/managers/:id" element={<ManagerPage />} />
            <Route path="/admins" element={<AdminListPage />} />
            <Route path="/admins/:id" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/repports" element={<Repports />} />
            <Route path="/repports/:id" element={<RepportSup />} />
            <Route
              path="/register/Admin"
              element={<SignUpPage passedRole="Admin" />}
            />
            <Route
              path="/register/Manager"
              element={<SignUpPage passedRole="Manager" />}
            />
            <Route
              path="/register/Superviseur"
              element={<SignUpPage passedRole="Superviseur" />}
            />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
};

export default App;
