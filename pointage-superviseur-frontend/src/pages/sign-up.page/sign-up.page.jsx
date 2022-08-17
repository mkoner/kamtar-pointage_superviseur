import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {createUser, reset} from '../../features/authSlice'

import FormInput from "../../components/form-input/forn-input.component";
import CustomButton from "../../components/custom-button/custom-button.component";

import "./sign-up.page.scss";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: ""
  });

  const { prenom, nom, email, password, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      navigate("/register");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

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
      prenom,
      nom,
      email,
      password,
      role,
    };

    dispatch(createUser(userData));
  };

  if (isLoading) {
    return <h4>Is Loading</h4>
  }

  return (
    <div className="sign-up">
      <form onSubmit={handleSubmit}>
        <FormInput
          name="prenom"
          type="text"
          handleChange={handleChange}
          value={prenom}
          label="prénom"
          required
        />
        <FormInput
          name="nom"
          type="text"
          value={nom}
          handleChange={handleChange}
          label="nom"
          required
        />
        <FormInput
          name="email"
          type="email"
          value={email}
          handleChange={handleChange}
          label="Addresse email"
          required
        />
        <FormInput
          name="password"
          type="password"
          value={password}
          handleChange={handleChange}
          label="Mot de passe"
          required
        />
        <div className="mb-3 form-item-container">
          <label className="form-label">Role</label>
          <div className="input-field-container select-div">
            <select
              id="role"
              name="role"
              value={role}
              onChange = {handleChange}
            >
              <option className="select-item" value="Admin">
                Admin
              </option>
              <option className="select-item" value="Manager">
                Manager
              </option>
              <option className="select-item" value="Superviseur">
                Superviseur
              </option>
            </select>
          </div>
        </div>
        <div className="buttons">
          <CustomButton type="submit"> Ajouter </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
