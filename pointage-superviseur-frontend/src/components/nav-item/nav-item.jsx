import { Link } from "react-router-dom";

import "./nav-item.scss";

function NavItem({ item }) {
  return (
    <Link to={item.to} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="home-nav-item">
        <div className="icon">
          <i className={item.icon} style={{ fontSize:"60px" }}></i>
        </div>
        <div className="title" style={{ fontSize:"20px" }}>{item.title}</div>
      </div>
    </Link>
  );
}

export default NavItem;
