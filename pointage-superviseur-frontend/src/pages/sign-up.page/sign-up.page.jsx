import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { createUser, reset } from "../../features/authSlice";

import Logo from "../../components/logo/logo";
import Navigation from "../navigation.page/navigation.page";

import addIcon from "../../assets/icon-add-white.svg";

import "./sign-up.page.scss";
import Spinner from "../../components/spinner/spinner.component";

const SignUpPage = ({ passedRole }) => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    numero: "",
    password: "",
    confirmedPassword: "",
    role: passedRole,
    type: "",
    numero2: "",
    residence:"",
  });
  const [displayNav, setDisplayNav] = useState(false);

  const {
    prenom,
    nom,
    email,
    password,
    role,
    numero,
    type,
    confirmedPassword,
    numero2,
    residence,
  } = formData;

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
        confirmedPassword: "",
        role: passedRole,
        type: "",
        numero: "",
        numero2: "",
        residence:"",
      }));
      toast.info(`${passedRole} créé`);
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

    if (!prenom || !nom || !numero) {
      toast.error("Le prénom, le nom ou le numéro ne peuvent être vide");
      return;
    }

    if (!(numero.replaceAll(" ", "").match('[0-9]{10}'))){
      toast.error("Veillez enregistrer un numéro de 10 chiffres");
      return;
    }

    if (email && !(email.replaceAll(" ", "").match("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])"))){
      toast.error("Verifier l'email");
      
      return;
    }

    if (passedRole == "Superviseur" && type == "") {
      toast.error("Renseignez le statut du superviseur");
      return;
    }

    if (password != confirmedPassword || password.length == 0) {
      toast.error("Echec de confirmation du mot de passe");
      return;
    }



    const userData = {
      prenom,
      nom,
      email,
      password,
      role,
      numero,
      numero2,
      type,
      residence,
    };

    userData.numero = numero.replaceAll(" ", "");
    userData.numero2 = numero2.replaceAll(" ", "");
    userData.email = email.length > 1 ? email.replaceAll(" ", "") : null;

    await dispatch(createUser(userData));
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
                    required
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
                    required
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">Numéro de téléphone*</label>
                <div>
                  <input
                    value={numero}
                    onChange={handleChange}
                    type="tel"
                    className="form-control"
                    placeholder="Entrer le numéro de téléphone"
                    name="numero"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              {passedRole == "Superviseur" && (
                <div className="form-group form-item">
                  <label className="col-form-label">
                    Numéro de téléphone 2
                  </label>
                  <div>
                    <input
                      value={numero2}
                      onChange={handleChange}
                      type="text"
                      className="form-control"
                      placeholder="Entrer un contact secondaire"
                      name="numero2"
                    />
                  </div>
                </div>
              )}

              {passedRole == "Superviseur" && (
                <div className="form-group form-item">
                  <label className="col-form-label">Lieu de résidence</label>
                  <div>
                    <input
                      value={residence}
                      onChange={handleChange}
                      type="text"
                      className="form-control"
                      placeholder="Entrez le lieu de residence"
                      name="residence"
                    />
                  </div>
                </div>
              )}

              <div className="form-group form-item">
                <label className="col-form-label">Addresse Email</label>
                <div>
                  <input
                    value={email}
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    placeholder="Entrer l'address Email"
                    name="email"
                  />
                </div>
              </div>

              <div
                className={`form-group form-item ${
                  passedRole != "Superviseur" ? "no-display" : ""
                }`}
              >
                <label className="col-form-label">Statut*</label>
                <div>
                  <select
                    name="type"
                    className="form-control"
                    onChange={handleChange}
                    required={passedRole == "Superviseur"}
                    value={type}
                  >
                    <option value=""></option>
                    <option value="interne">Interne</option>
                    <option value="externe">Externe</option>
                    <option value="contractuel">Contractuel</option>
                  </select>
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
                    required
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">
                  Confirmer Mot de Passe*
                </label>
                <div>
                  <input
                    value={confirmedPassword}
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    id="password1"
                    name="confirmedPassword"
                    placeholder="Confirmer le mot de passe"
                    required
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
                numero.length == 0 ||
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
