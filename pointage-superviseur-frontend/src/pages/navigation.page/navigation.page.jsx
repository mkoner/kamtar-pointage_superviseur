import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../features/authSlice";
import Logo from '../../assets/logo-blanc.png'

import "./navigation.page.css";

const Navigation = ({ display, close }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser } = useSelector((state) => state.auth);

  const role = loggedInUser ? loggedInUser.role.toLowerCase() : null;
  const id = loggedInUser ? loggedInUser.id : null;

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loggedInUser)
    return (
      <div className={`navigation-container ${display ? "" : "no-display"}`}>
        <div>
          <div className="navigation-top">
            <div className="navigation-logo">
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <img
                  src={Logo}
                  alt="kamtar logo"
                  height={60}
                />
              </Link>
              <span className="fi fi-gr fis"></span>
            </div>
            <div className="close" onClick={close}>
              X
            </div>
          </div>

          <nav>
            <div className="navigation-actions nav-group">
              <ul>
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="nav-item" onClick={close}>
                    <i className="bi bi-house"></i>
                    <li className="nav-item-element">Accueil </li>
                  </div>
                </Link>
                <Link
                  to="/missions"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="nav-item" onClick={close}>
                    <i className="bi bi-arrow-left-right"></i>
                    <li className="nav-item-element">Missions </li>
                  </div>
                </Link>
                <Link
                  to="/superviseurs"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className={`nav-item ${
                      loggedInUser.role == "Superviseur" ? "no-display" : ""
                    }`}
                    onClick={close}
                  >
                    <i className="bi bi-people-fill"></i>
                    <li className="nav-item-element">Superviseurs</li>
                  </div>
                </Link>
                <Link
                  to="/repports"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className={`nav-item ${
                      loggedInUser.role == "Superviseur" ? "no-display" : ""
                    }`}
                    onClick={close}
                  >
                    <i className="bi bi-clipboard-pulse"></i>
                    <li className="nav-item-element">Rapports</li>
                  </div>
                </Link>
              </ul>
            </div>

            <div className="navigation-account nav-group">
              <ul>
                <Link
                  to="/admins"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className={`nav-item ${
                      loggedInUser.role != "Admin" ? "no-display" : ""
                    }`}
                    onClick={close}
                  >
                    <i className="bi bi-person-plus-fill"></i>
                    <li className="nav-item-element">Admins</li>
                  </div>
                </Link>
                <Link
                  to="/managers"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className={`nav-item ${
                      loggedInUser.role != "Admin" ? "no-display" : ""
                    }`}
                    onClick={close}
                  >
                    <i className="bi bi-person-workspace"></i>
                    <li className="nav-item-element">Managers</li>
                  </div>
                </Link>
                <Link
                  to={`/${role}s/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="nav-item" onClick={close}>
                    <i className="bi bi-person-circle"></i>
                    <li className="nav-item-element">Mon compte</li>
                  </div>
                </Link>
                <div className="nav-item" onClick={handleLogOut}>
                  <i className="bi bi-power "></i>
                  <li className="nav-item-element"> Déconnexion</li>
                </div>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  else return <></>;
};

export default Navigation;
