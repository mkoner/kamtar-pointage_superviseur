import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MaterialReactTable from "material-react-table";
import { toast } from "react-toastify";

import { getUserById, reset, updateUser } from "../../features/authSlice";
import { getMissionsBySup, deleteMission } from "../../features/missionSlice";

import CustomButton from "../../components/custom-button/custom-button.component";
import Logo from "../../components/logo/logo";
import Navigation from "../navigation.page/navigation.page";

import "./user-page.scss";

import deleteIcon from "../../assets/delete.svg";
import modifyIcon from "../../assets/pen-white.svg";
import Spinner from "../../components/spinner/spinner.component";

function Userpage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser, selectedUser, isLoading, isError, message } =
    useSelector((state) => state.auth);
  const { missions } = useSelector((state) => state.missions);

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

      dispatch(getMissionsBySup(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [loggedInUser, navigate, isError, message, id, dispatch]);

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

  // delete mission
  const handleDelete = (id) => {
    dispatch(deleteMission(id));
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
      numero2: userData.user.numero2.replaceAll(" ", ""),
      type: userData.user.type,
      password: passwords.confirmedPassword
        ? passwords.confirmedPassword
        : null,
      is_active: userData.user.is_active,
      residence: userData.user.residence,
      role: userData.user.role,
    };
    await dispatch(updateUser(data));
    setPasswords({
      password: "",
      confirmedPassword: "",
    });
    await dispatch(getUserById(id));
  };

  // Columns for Material UI Table
  const columns1 = useMemo(
    () => [
      {
        header: "ID",
        size: 10,
        maxSize: 10,
        accessorFn: (row) => row.id,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Superviseurs",
        accessorFn: (row) => row.nom_superviseur,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      },
      {
        header: "Client",
        accessorFn: (row) => row.nom_client,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      },
      {
        header: "Statut",
        accessorFn: (row) => row.statut,
        sortable: true,
        filterFn: "equals",
        filterSelectOptions: [
          { text: "créé", value: "créé" },
          { text: "debut validé", value: "debut validé" },
          { text: "terminé", value: "terminé" },
          { text: "terminé validé", value: "terminé validé" },
          { text: "tous", value: "" },
        ],
        filterVariant: "select",
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      },
      {
        header: "Date début",
        accessorFn: (row) => new Date(row.date_debut).toLocaleDateString(),
        sortable: true,
        enableColumnFilter: false,
        size: 20,
        minSize: 10,
        maxSize: 30,
      },
      {
        header: "Début validé",
        accessorFn: (row) => (row.date_debut_validation_date ? "OUI" : "NON"),
        filterFn: "equals",
        filterSelectOptions: [
          { text: "oui", value: "OUI" },
          { text: "non", value: "NON" },
          { text: "tous", value: "" },
        ],
        filterVariant: "select",
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        minSize: 10, //min size enforced during resizing
        maxSize: 30, //max size enforced during resizing
        size: 20, //medium column
      },
      {
        header: "Date fin",
        accessorFn: (row) => new Date(row.date_fin).toLocaleDateString(),
        sortable: true,
        enableColumnFilter: false,
        size: 20,
        minSize: 10,
        maxSize: 30,
      },
      {
        header: "Fin validé",
        accessorFn: (row) => (row.date_fin_validation_date ? "OUI" : "NON"),
        filterFn: "equals",
        filterSelectOptions: [
          { text: "oui", value: "OUI" },
          { text: "non", value: "NON" },
          { text: "tous", value: "" },
        ],
        filterVariant: "select",
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        minSize: 10, //min size enforced during resizing
        maxSize: 30, //max size enforced during resizing
        size: 20, //medium column
      },
      {
        header: null,
        accessorKey: "id",
        enableColumnFilter: false,
        size: 10,
        Cell: ({ cell }) => (
          <img
            src={deleteIcon}
            alt="delete icon"
            height="20px"
            onClick={() => handleDelete(cell.getValue())}
          />
        ),
      },
    ],
    []
  );

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
              to="/superviseurs"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Superviseurs
            </Link>
          </span>
          <span>&nbsp;&#62;&nbsp;</span>
          <span>Détail de superviseur</span>
        </div>
        <h1 style={{ fontWeight: "300" }}>
          Superviseur {selectedUser.prenom + " " + selectedUser.nom}
        </h1>

        <div>
          <div className="info-personnelles user-page-section mb-2 mt-4">
            <h4 className="card-title">Informations Personnelles</h4>
            <div className="input-fields">
              <div className="form-group form-item">
                <label className="col-form-label">Prénom</label>
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
                <label className="col-form-label">Numéro de téléphone 2</label>
                <div>
                  <input
                    type="text"
                    value={userData.user.numero2}
                    onChange={handleChange}
                    name="numero2"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group form-item">
                <label className="col-form-label">Lieu de résidence</label>
                <div>
                  <input
                    type="text"
                    value={userData.user.residence}
                    onChange={handleChange}
                    name="residence"
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

              <div className="form-group form-item">
                <label className="col-form-label">Statut</label>
                <div>
                  <select
                    name="type"
                    className="form-control"
                    onChange={handleChange}
                    value={userData.user.type}
                  >
                    <option value="interne">Interne</option>
                    <option value="externe">Externe</option>
                    <option value="contractuel">Contractuel</option>
                  </select>
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
          <div
            className="btn btn-primary btn-success btn-add-new add-user mt-4"
            onClick={modifyUser}
          >
            <img src={modifyIcon} alt="add icon" />
            <span>Modifier Superviseur</span>
          </div>
        </div>

        <div className="missions user-page-section mt-4 mb-4">
          <h4 className="card-title mb-4">Missions</h4>
          <div className="missions">
            <MaterialReactTable
              columns={columns1}
              data={missions}
              enableTopToolbar={false}
              initialState={{ showColumnFilters: true }}
              enableColumnActions={false}
              muiTableBodyRowProps={({ row }) => ({
                onClick: (event) => {
                  navigate(`/missions/${row.original.id}`);
                },
              })}
              displayColumnDefOptions={{
                "mrt-row-numbers": {
                  size: 10,
                },
                "mrt-row-expand": {
                  size: 10,
                },
              }}
              muiTableHeadCellFilterTextFieldProps={{
                sx: { m: "0", width: "100%", p: "0", mt: "2" },
                variant: "standard",
                size: "small",
              }}
            />
          </div>
          <div className="mt-4"></div>
        </div>
      </div>
    </div>
  );
}

export default Userpage;
