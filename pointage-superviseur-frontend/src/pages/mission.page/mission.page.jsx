import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
// date library
import moment from "moment";
import { toast } from "react-toastify";

import {
  reset,
  getMissionById,
  updateMission,
  deleteMission,
  validateDate,
  finMission,
} from "../../features/missionSlice";

import {
  getCommentsByMission,
  getCommentById,
  respondToComment,
  createComment,
  deleteComment,
  resetComments,
} from "../../features/commentSlice";

import Navigation from "../navigation.page/navigation.page";
import Logo from "../../components/logo/logo";

import modifyIcon from "../../assets/pen-white.svg";
import validateIcon from "../../assets/validate_white.svg";
import addIcon from "../../assets/icon-add-white.svg";

import "./mission.page.scss";
import Spinner from "../../components/spinner/spinner.component";

const MissionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser } = useSelector((state) => state.auth);
  const { selectedMission, isLoading, isError, message } = useSelector(
    (state) => state.missions
  );

  const userMessage = useSelector((state) => state.auth.message);

  const {
    comments,
    selectedComment,
    isCommentsError,
    commentsMessage,
    isCommentsSuccess,
    isCommentsLoading,
  } = useSelector((state) => state.comments);

  const [missionData, setMissionData] = useState({
    dateDebut: "",
    dateFin: "",
    client: "",
    codeOperation: "",
  });

  const [myComment, setMyComment] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [displayNav, setDisplayNav] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!loggedInUser || userMessage == "Not authorized") {
      navigate("/login");
    }
    if (loggedInUser) {
      dispatch(getMissionById(id));

      dispatch(getCommentsByMission(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [loggedInUser, navigate, isError, message, id, dispatch]);

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
    if (data.date == null) {
      toast.error("Reinseigner la date de fin");
      return;
    }
    await dispatch(validateDate(data));
    await dispatch(getMissionById(id));
  };

  const finDeMission = async (evt) => {
    evt.preventDefault();

    confirmAlert({
      title: "Confirmer Fin de mission ",
      message: "Voulez-vous vraiment mettre fin à cette mission?",
      buttons: [
        {
          label: "OUI",
          onClick: async () => {
            await dispatch(finMission(id));
            await dispatch(getMissionById(id));
          },
        },
        {
          label: "NON",
          onClick: () => console.log("No"),
        },
      ],
    });
  };

  const handleUpdateMission = async (evt) => {
    evt.preventDefault();

    const data = {
      id: id,
      client: missionData.client,
      codeOperation: missionData.codeOperation,
    };

    await dispatch(updateMission(data));
    await dispatch(getMissionById(id));
  };

  const addComment = async (evt) => {
    evt.preventDefault();
    const data = {
      mission_id: id,
      message: myComment,
    };
    if (data.message.length < 1) return;
    await dispatch(createComment(data));
    document.getElementById("closeModal").click();
    dispatch(getCommentsByMission(id));
    await dispatch(getMissionById(id));
  };

  const respondToTheComment = async () => {
    const data = {
      id: selectedId,
      response: myComment,
    };

    if (data.response.length < 1) return;
    await dispatch(respondToComment(data));
    document.getElementById("closeModal1").click();
    if (isCommentsError) {
      toast.error(commentsMessage);
    }
    dispatch(getCommentsByMission(id));
    await dispatch(getMissionById(id));
  };

  if (isLoading) {
    return <Spinner />;
  }

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
  };

  const handleClickClose = () => {
    setDisplayNav(false);
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
          <div className="mission-info-btn mt-4">
            <div className="info-mission user-page-section">
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
              className="btn btn-primary btn-success btn-add-new add-user mt-2"
              onClick={handleUpdateMission}
            >
              <img src={modifyIcon} alt="add icon" />
              <span>Modifier Mission</span>
            </div>
          </div>

          <div className="mission-info-btn mt-4">
            <div className="info-mission user-page-section">
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
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Validé Par</label>
                  <div>
                    <input
                      type="text"
                      value={selectedMission.date_debut_valide_par_prenom}
                      name="validePar"
                      className="form-control"
                      disabled
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
                      disabled
                    />
                  </div>
                </div>
              </div>
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

          <div className="mission-info-btn mt-4">
            <div className="info-mission user-page-section">
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
                </div>

                <div className="form-group form-item">
                  <label className="col-form-label">Validé Par</label>
                  <div>
                    <input
                      type="text"
                      value={selectedMission.date_fin_valide_par_prenom}
                      name="validePar"
                      className="form-control"
                      disabled
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
                      disabled
                    />
                  </div>
                </div>
              </div>
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
        </div>

        <div className="comments mt-4">
          <div
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#myModal"
          >
            <img src={""} alt="add icon" />
            <span>Ajouter un commentaire</span>
          </div>

          <div
            className="modal fade"
            id="myModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Entrez votre commentaire
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      onChange={(evt) => setMyComment(evt.target.value)}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="closeModal"
                    data-bs-dismiss="modal"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={addComment}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="myModal1"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Entrer votre réponse
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      onChange={(evt) => setMyComment(evt.target.value)}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="closeModal1"
                    data-bs-dismiss="modal"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={respondToTheComment}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="commentsDisplay">
            {comments.map((comment) => (
              <div className="commentContainer">
                <div className="commentDiv">
                  <div className="commented-by">
                    {comment.commented_by_display}
                  </div>
                  <div className="comment">{comment.message}</div>
                </div>
                {!comment.response && (
                  <div>
                    <span
                      className="respond"
                      data-bs-toggle="modal"
                      data-bs-target="#myModal1"
                      onClick={() => setSelectedId(comment.id)}
                    >
                      Répondre
                    </span>
                  </div>
                )}
                {comment.response && (
                  <div className="responsDiv">
                    <div className="commented-by">
                      {comment.responded_by_display}
                    </div>
                    <div className="comment">{comment.response}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;
