import React from "react";
import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import LoginPage from "./pages/login.page/login.page";
import SignUpPage from "./pages/sign-up.page/sign-up.page";
import MissionPage from "./pages/mission.page/mission.page";
import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";
import MissionList from './pages/mission-list.page/mission-list.page'

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MissionList />} />
            <Route path="/missions" element={<MissionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
        <Footer />
      </div>
    );
  }
}

export default App;
