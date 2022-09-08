import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import logo from '../../assets/logo_picto.png'

import { login, reset } from "../../features/authSlice";

import "./login.page.scss";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || loggedInUser) {
      navigate("/");
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

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <h4>Is Loading</h4>;
  }

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper">
        <div className="row">
          <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <div id="logo_center_bar">
              <img src={logo} />
            </div>
            <br />
            <br />
            <h4
              className="h4-kamtar"
              style={{ fontWeight: "bold", fontSize: "1.13rem" }}
            >
              Pointage Superviseur Connexion
            </h4>
            <form className="pt-5">
              <div className="form-group">
                <label
                  htmlFor="email"
                  data-i18n="account.email_or_telephone"
                >
                  Adresse e-mail*
                </label>
                <input
                  value={email}
                  onChange={handleChange}
                  type="email"
                  className="form-control"
                  id="email_or_telephone"
                  aria-describedby="emailHelp"
                  name="email"
                />
                <i className="mdi mdi-account"></i>
              </div>
              <div className="form-group ">
                <label htmlFor="password">Mot de passe*</label>
                <input
                  value={password}
                  onChange={handleChange}
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                />
              </div>
              <div className="mt-5">
                <input
                  disabled={
                    email.length == 0 ||
                    password.length == 0 ||
                    isLoading
                  }
                  type="button"
                  onClick={handleSubmit}
                  value={isLoading ? "Patientez..." : "Connexion"}
                  className="btn btn-block btn-success btn-lg font-weight-medium login-btn"
                  id="login"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
