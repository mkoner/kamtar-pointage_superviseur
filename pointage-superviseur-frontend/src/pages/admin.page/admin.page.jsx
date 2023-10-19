import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { getUserById, reset, updateUser } from "../../features/authSlice";

import Navigation from "../navigation.page/navigation.page";
import Logo from "../../components/logo/logo";

import "./admin.page.scss";

import modifyIcon from "../../assets/pen-white.svg";
import Spinner from "../../components/spinner/spinner.component";

function AdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser, selectedUser, isLoading, isError, message } =
    useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    user: {},
    missions: [],
  });

  const [passwords, setPasswords] = useState({
    password: "",
    confirmedPassword: "",
  });

  const [displayNav, setDisplayNav] = useState(false);

  useEffect(() => {
    if (isError) {
      toast(message);
    }

    if (!loggedInUser || message == "Not authorized") {
      navigate("/login");
    }
    if (loggedInUser) {
      dispatch(getUserById(id));
      setUserData((prevState) => ({
        ...prevState,
        user: selectedUser,
      }));
    }

    return () => {
      dispatch(reset());
    };
  }, [loggedInUser, navigate, isError, id, dispatch]);

  useEffect(() => {
    setUserData((prevState) => ({
      ...prevState,
      user: selectedUser,
    }));
  }, [isLoading]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setUserData((prevState) => ({
      user: {
        ...prevState.user,
        [name]: value,
      },
    }));
  };

  //Update User
  const modifyUser = async (evt) => {
    evt.preventDefault();
    console.log(passwords.password, passwords.confirmedPassword);
    if (passwords.password != passwords.confirmedPassword) {
      toast.error("Echec de confirmation du mot de passe");
      setPasswords({
        password: "",
        confirmedPassword: "",
      });
      return;
    }
    const data = {
      id: id,
      prenom: userData.user.prenom,
      nom: userData.user.nom,
      email: userData.user.email.replaceAll(" ", ""),
      numero: userData.user.numero.replaceAll(" ", ""),
      password: passwords.confirmedPassword
        ? passwords.confirmedPassword
        : null,
      is_active: userData.user.is_active,
      role: userData.user.role,
    };
    await dispatch(updateUser(data));
    setPasswords({
      password: "",
      confirmedPassword: "",
    });
    await dispatch(getUserById(id));
  };

  const handleClickOpen = () => {
    setDisplayNav(true);
  };

  const handleClickClose = () => {
    setDisplayNav(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="user-page">
      <div className="top-section">
        <div className="logo">
          <Logo onClick={handleClickOpen} />
          <Navigation display={displayNav} close={handleClickClose} />
        </div>
      </div>

      <div className="page-container">
        <div className="fil">
          <span>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Accueil
            </Link>
          </span>
          <span>&nbsp;&#62;&nbsp;</span>
          <span>
            <Link
              to="/admins"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Admins
            </Link>
          </span>
          <span>&nbsp;&#62;&nbsp;</span>
          <span>Détail de Admin</span>
        </div>
        <h1 style={{ fontWeight: "300" }}>
          Admin {selectedUser.prenom + " " + selectedUser.nom}
        </h1>

        <div className="cards">
          <div className="info-personnelles user-page-section mb-2 mt-4">
            <h4 className="card-title">Informations Personnelles</h4>
            <div className="input-fields">
              <div className="form-group form-item">
                <label className="col-form-label">Prénon</label>
                <div>
                  <input
                    type="text"
                    value={userData.user.prenom}
                    onChange={handleChange}
                    name="prenom"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">Nom</label>
                <div>
                  <input
                    type="text"
                    value={userData.user.nom}
                    onChange={handleChange}
                    name="nom"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">Numéro de téléphone</label>
                <div>
                  <input
                    type="text"
                    value={userData.user.numero}
                    onChange={handleChange}
                    name="numero"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">Email</label>
                <div>
                  <input
                    type="text"
                    value={userData.user.email}
                    onChange={handleChange}
                    name="email"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-group form-item">
                <label className="col-form-label">Nouveau mot de passe</label>
                <div>
                  <input
                    type="password"
                    value={passwords.password}
                    onChange={(evt) =>
                      setPasswords((prev) => {
                        return {
                          ...prev,
                          password: evt.target.value,
                        };
                      })
                    }
                    name="password"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">
                  Confirmer Nouveau de passe
                </label>
                <div>
                  <input
                    type="password"
                    value={passwords.confirmedPassword}
                    onChange={(evt) =>
                      setPasswords((prev) => {
                        return {
                          ...prev,
                          confirmedPassword: evt.target.value,
                        };
                      })
                    }
                    name="confirmedPassword"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="active input-field form-group form-item">
                <label htmlFor="" className="col-form-label">
                  Utilisateur Activé?
                </label>
                <div className="radio-items">
                  <div className="radio-item">
                    <label>Oui</label>
                    <input
                      type="radio"
                      id="html"
                      name="is_active"
                      value="oui"
                      checked={userData.user.is_active ? "checked" : ""}
                      onClick={(evt) =>
                        setUserData((prevState) => ({
                          ...prevState,
                          user: {
                            ...prevState.user,
                            is_active: 1,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="radio-item">
                    <label>Non</label>
                    <input
                      type="radio"
                      id="css"
                      name="is_active"
                      value="non"
                      checked={userData.user.is_active ? "" : "checked"}
                      onClick={(evt) =>
                        setUserData((prevState) => ({
                          ...prevState,
                          user: {
                            ...prevState.user,
                            is_active: 0,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modify">
            <div
              className="btn btn-primary btn-success btn-add-new add-user mt-4"
              onClick={modifyUser}
            >
              <img src={modifyIcon} alt="add icon" />
              <span>Modifier Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
