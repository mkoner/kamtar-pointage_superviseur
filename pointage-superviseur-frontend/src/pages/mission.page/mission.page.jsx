import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// date library
import moment from "moment";

import {
  reset,
  getMissionById,
  updateMission,
  deleteMission,
  validateDate,
  finMission,
} from "../../features/missionSlice";

import Navigation from "../navigation.page/navigation.page";
import Logo from "../../components/logo/logo";

import modifyIcon from "../../assets/pen-white.svg";
import validateIcon from "../../assets/validate_white.svg";

import "./mission.page.scss";

const MissionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser } = useSelector((state) => state.auth);
  const { selectedMission, isLoading, isError, message } = useSelector(
    (state) => state.missions
  );

  const [missionData, setMissionData] = useState({
    dateDebut: "",
    dateFin: "",
    client: "",
    codeOperation: "",
  });

  const [displayNav, setDisplayNav] = useState(false);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!loggedInUser) {
      navigate("/login");
    }

    dispatch(getMissionById(id));

    return () => {
      dispatch(reset());
    };
  }, [loggedInUser, navigate, isError, message, id]);

  useEffect(() => {
    setMissionData((prevState) => ({
      ...prevState,
      dateDebut: selectedMission.date_debut,
      dateFin: selectedMission.date_fin,
      client: selectedMission.nom_client,
      codeOperation: selectedMission.code_operation,
    }));
  }, [isLoading]);

  const hancleChange = (evt) => {
    const { name, value } = evt.target;
    setMissionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateDateBebut = async (evt) => {
    evt.preventDefault();
    const data = {
      id: id,
      type: "debut",
      date: missionData.dateDebut,
    };
    await dispatch(validateDate(data));
    await dispatch(getMissionById(id));
  };

  const validateDateFin = async (evt) => {
    evt.preventDefault();
    const data = {
      id: id,
      type: "fin",
      date: missionData.dateFin,
    };
    await dispatch(validateDate(data));
    await dispatch(getMissionById(id));
  };

  const finDeMission = async (evt) => {
    evt.preventDefault();
    await dispatch(finMission(id));
    await dispatch(getMissionById(id));
  };

  const handleUpdateMission = async (evt) => {
    evt.preventDefault();
    console.log("Update mission called");

    const data = {
      id: id,
      client: missionData.client,
      codeOperation: missionData.codeOperation,
    };
    console.log("Mission page", data);
    await dispatch(updateMission(data));
    await dispatch(getMissionById(id));
  };

  if (isLoading) {
    return <h4>Loading</h4>;
  }

  console.log(missionData);

  const dateDebutDisplay = selectedMission.date_debut
    ? moment(missionData.dateDebut).format("YYYY-MM-DD")
    : null;
  const dateDebutValide = selectedMission.date_debut_validation_date
    ? new Date(selectedMission.date_debut_validation_date).toLocaleDateString()
    : null;
  const dateFinDisplay = selectedMission.date_fin
    ? moment(missionData.dateFin).format("YYYY-MM-DD")
    : null;
  const dateFinValide = selectedMission.date_fin_validation_date
    ? new Date(selectedMission.date_fin_validation_date).toLocaleDateString()
    : null;

  const handleClickOpen = () => {
    setDisplayNav(true);
    console.log(displayNav);
  };

  const handleClickClose = () => {
    setDisplayNav(false);
    console.log(displayNav);
  };

  return (
    <div className="mission-page">
      <div className="logo">
        <Logo onClick={handleClickOpen} />
        <Navigation display={displayNav} close={handleClickClose} />
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
              to="/missions"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Missions
            </Link>
          </span>
          <span>&nbsp;&#62;&nbsp;</span>
          <span>Détail de mission</span>
        </div>

        <div className="mission-page-top">
          <h1 style={{ fontWeight: "300" }}>
            Mission: {selectedMission.nom_client}{" "}
            {selectedMission.code_operation
              ? selectedMission.code_operation
              : ""}
          </h1>
          <div
            className={`btn btn-primary btn-success btn-add-new add-user ${
              loggedInUser.role != "Superviseur" || selectedMission.date_fin
                ? "no-display"
                : ""
            }`}
            onClick={finDeMission}
          >
            <img src={validateIcon} alt="add icon" />
            <span>Find De Mission</span>
          </div>
        </div>

        <div className="mission-cards">
          <div className="mission-info-btn">
            <div className="info-mission user-page-section mb-2 mt-4">
              <h4 className="card-title">Info de Mission</h4>
              <div className="input-fields">
                <div className="form-group form-item">
                  <label className="col-form-label">Client</label>
                  <div>
                    <input
                      type="text"
                      value={missionData.client}
                      onChange={hancleChange}
                      name="client"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Code Opération</label>
                  <div>
                    <input
                      type="text"
                      value={missionData.codeOperation}
                      onChange={hancleChange}
                      name="codeOperation"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Statut</label>
                  <div>
                    <input
                      type="text"
                      value={selectedMission.statut}
                      name="statut"
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Superviseur</label>
                  <div>
                    <input
                      type="text"
                      value={selectedMission.nom_superviseur}
                      disabled
                      name="superviseur"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="btn btn-primary btn-success btn-add-new add-user mt-4"
              onClick={handleUpdateMission}
            >
              <img src={modifyIcon} alt="add icon" />
              <span>Modifier Mission</span>
            </div>
          </div>

          <div className="mission-card-2">
            <div className="info-debut user-page-section mb-2 mt-4 mr-4">
              <h4 className="card-title">Début de Mission</h4>
              <div className="input-fields">
                <div className="form-group form-item">
                  <label className="col-form-label">Date Début</label>
                  <div>
                    <input
                      type="date"
                      value={dateDebutDisplay}
                      onChange={hancleChange}
                      name="dateDebut"
                      className="form-control"
                    />
                  </div>
                  <div
                    className={`btn btn-primary btn-success btn-add-new add-user mt-2 ${
                      loggedInUser.role == "Superviseur" ? "no-display" : ""
                    }`}
                    onClick={validateDateBebut}
                  >
                    <img src={validateIcon} alt="add icon" />
                    <span>Valider Début</span>
                  </div>
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Validé Par</label>
                  <div>
                    <input
                      type="text"
                      value={selectedMission.date_debut_valide_par_prenom}
                      name="validePar"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Date de validation</label>
                  <div>
                    <input
                      type="text"
                      value={dateDebutValide}
                      name="dateValidation"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="info-fin user-page-section mb-2 mt-4 ml-4">
              <h4 className="card-title">Fin de Mission</h4>
              <div className="input-fields">
                <div className="form-group form-item">
                  <label className="col-form-label">Date Fin</label>
                  <div>
                    <input
                      type="date"
                      value={dateFinDisplay}
                      onChange={hancleChange}
                      name="dateFin"
                      className="form-control"
                    />
                  </div>
                  <div
                    className={`btn btn-primary btn-success btn-add-new add-user mt-2 ${
                      loggedInUser.role == "Superviseur" ? "no-display" : ""
                    }`}
                    onClick={validateDateFin}
                  >
                    <img src={validateIcon} alt="add icon" />
                    <span>Valider Fin</span>
                  </div>
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Validé Par</label>
                  <div>
                    <input
                      type="text"
                      value={selectedMission.date_fin_valide_par_prenom}
                      name="validePar"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Date de validation</label>
                  <div>
                    <input
                      type="text"
                      value={dateFinValide}
                      name="dateValidation"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;
