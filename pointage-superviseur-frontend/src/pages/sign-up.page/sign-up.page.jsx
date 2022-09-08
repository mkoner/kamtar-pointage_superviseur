import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { createUser, reset } from "../../features/authSlice";

import Logo from "../../components/logo/logo";
import Navigation from "../navigation.page/navigation.page";

import addIcon from "../../assets/icon-add-white.svg";

import "./sign-up.page.scss";

const SignUpPage = ({ passedRole }) => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: passedRole,
  });
  const [displayNav, setDisplayNav] = useState(false);

  const { prenom, nom, email, password, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser, isLoading, isError, isSuccess, message, created } =
    useSelector((state) => state.auth);

  const passedRole1 = passedRole.toLowerCase();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (created) {
      setFormData((prevState) => ({
        ...prevState,
        prenom: "",
        nom: "",
        email: "",
        password: "",
        role: passedRole,
      }));
      toast.info("User Created");
      navigate(`/${passedRole1}s`);
    }

    dispatch(reset());
  }, [loggedInUser, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const userData = {
      prenom,
      nom,
      email,
      password,
      role,
    };

    await dispatch(createUser(userData));
  };

  const handleClickOpen = () => {
    setDisplayNav(true);
    console.log(displayNav);
  };

  const handleClickClose = () => {
    setDisplayNav(false);
    console.log(displayNav);
  };

  if (isLoading) {
    return <h4>Is Loading</h4>;
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
              to={`/${passedRole1}s`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {`${passedRole}s`}
            </Link>
          </span>
          <span>&nbsp;&#62;&nbsp;</span>
          <span>Ajouter {passedRole}</span>
        </div>
        <h1 style={{ fontWeight: "300" }}>Ajouter {passedRole}</h1>

        <div className="cards">
          <div className="info-personnelles user-page-section mb-2 mt-4">
            <h4 className="card-title">Informations Personnelles</h4>
            <div className="input-fields">
              <div className="form-group form-item">
                <label className="col-form-label">Prénom*</label>
                <div>
                  <input
                    value={prenom}
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    id="prenom"
                    name="prenom"
                    placeholder="Entrer prénom(s)"
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">Nom*</label>
                <div>
                  <input
                    value={nom}
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    name="nom"
                    placeholder="Entrer le nom"
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">Addresse Email</label>
                <div>
                  <input
                    value={email}
                    onChange={handleChange}
                    type="email"
                    className="form-control"
                    placeholder="Entrer l'address Email"
                    name="email"
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">Mot de Passe*</label>
                <div>
                  <input
                    value={password}
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Créer un mot de passe"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modify">
            <div
              className="btn btn-primary btn-success btn-add-new add-user mt-4"
              onClick={handleSubmit}
              disabled={
                email.length == 0 ||
                password.length == 0 ||
                nom.length == 0 ||
                prenom.length == 0
              }
            >
              <img src={addIcon} alt="add icon" />
              <span>Ajouter {passedRole}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
