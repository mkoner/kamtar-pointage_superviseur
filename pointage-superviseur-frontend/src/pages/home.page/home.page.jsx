import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";


import Navigation from "../navigation.page/navigation.page";
import Logo from "../../components/logo/logo";
import NavItem from "../../components/nav-item/nav-item";
import LoginPage from "../login.page/login.page"

import "./home.page.scss";

function HomePage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUser, message } = useSelector((state) => state.auth);
  
  const [displayNav, setDisplayNav] = useState(false);

  const getNavList = (role) => {
    if (role == "Admin")
      return [
        {
          title: "Missions",
          icon: "bi bi-arrow-left-right",
          to: "/missions",
        },
        {
          title: "Superviseurs",
          icon: "bi bi-people-fill",
          to: "/superviseurs",
        },
        {
          title: "Rapports",
          icon: "bi bi-clipboard-pulse",
          to: "/repports",
        },
        {
          title: "Managers",
          icon: "bi bi-person-workspace",
          to: "/managers",
        },
        {
          title: "Admins",
          icon: "bi bi-person-plus-fill",
          to: "/admins",
        },
      ];
    else if (role == "Manager")
      return [
        {
          title: "Superviseurs",
          icon: "bi bi-people-fill",
          to: "/superviseurs",
        },
        {
          title: "Missions",
          icon: "bi bi-arrow-left-right",
          to: "/missions",
        },
        {
          title: "Rapports",
          icon: "bi bi-clipboard-pulse",
          to: "/repports",
        },
      ];
    else
      return [
        {
          title: "Missions",
          icon: "bi bi-arrow-left-right",
          to: "/missions",
        },
      ];
  };

  const navList = loggedInUser ? getNavList(loggedInUser.role) : []

  useEffect(() => {
    if (!loggedInUser || message == "Not authorized") {
      navigate("/login");
    }
  }, [loggedInUser, navigate]); 

  const handleClickOpen = () => {
    setDisplayNav(true);
  };

  const handleClickClose = () => {
    setDisplayNav(false);
  };

 

  if (loggedInUser)
    return (
    <div className="home-page">
      <div className="logo">
        <Logo onClick={handleClickOpen} />
        <Navigation display={displayNav} close={handleClickClose} />
      </div>
      <div className="page-container">
        <div className="itemss">
          {navList.map((item, index) => {
            return <NavItem key={index} item={item} />;
          })}
        </div>
      </div>
    </div>
    );
  
  else return <LoginPage/>
}

export default HomePage;
