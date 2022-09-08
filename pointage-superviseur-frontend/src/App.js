import React from "react";
import { useState } from "react";
import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/login.page/login.page";
import SignUpPage from "./pages/sign-up.page/sign-up.page";
import MissionPage from "./pages/mission.page/mission.page";
import Header from "./components/header/header.component";
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
import Logo from "./components/logo/logo";
import Navigation from "./pages/navigation.page/navigation.page";

const App = () => {

    return (
      <div className="App">
        <div className="elements-container">
          <BrowserRouter className="browser-router">
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/missions">
                <Route index element={<MissionList />} />
                <Route path=":id" element={<MissionPage />} />
              </Route>
              <Route path="/create-mission" element={<CreateMission />} />
              <Route path="/superviseurs">
                <Route index element={<UserList />} />
                <Route path=":id" element={<UserPage />} />
              </Route>
              <Route path="/managers">
                <Route index element={<ManagerListPage />} />
                <Route path=":id" element={<ManagerPage />} />
              </Route>
              <Route path="/admins">
                <Route index element={<AdminListPage />} />
                <Route path=":id" element={<AdminPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/repports" element={<Repports />} /> 
              <Route path="/repports/:id" element={<RepportSup/>} />
              <Route path="/register/Admin" element={<SignUpPage passedRole="Admin" />} />
              <Route path="/register/Manager" element={<SignUpPage passedRole="Manager" />} />
              <Route path="/register/Superviseur" element={<SignUpPage passedRole="Superviseur"/>} />
              
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </div>
        <Footer />
      </div>
    );
}

export default App;
