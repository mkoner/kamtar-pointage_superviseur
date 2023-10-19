import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { createMission, reset } from "../../features/missionSlice";
import addIcon from "../../assets/pen-white.svg";

import Logo from "../../components/logo/logo";
import Navigation from "../navigation.page/navigation.page";

import "./create-mission.scss";
import Spinner from "../../components/spinner/spinner.component";

function CreateMission() {
  const [missionData, setMissionData] = useState({
    client: "",
    opCode: "",
  });

  const { client, opCode } = missionData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.missions
  );

  const { loggedInUser } = useSelector((state) => state.auth);
  const userMessage = useSelector((state) => state.auth.message);

  useEffect(() => {
    if (!loggedInUser || userMessage == "Not authorized") {
      navigate("/login");
    }
 
    if (isError) {
      toast.error(message);
    }

    dispatch(reset())
    
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setMissionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    dispatch(reset());
    evt.preventDefault();
    const mission = {
      nom_client: client,
      code_operation: opCode,
    };
    await dispatch(createMission(mission));
    navigate("/missions");
  };

  const [displayNav, setDisplayNav] = useState(false);

  const handleClickOpen = () => {
    setDisplayNav(true);
  };

  const handleClickClose = () => {
    setDisplayNav(false);
  };

  if (isLoading) {
    return <Spinner/>
  }

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
            <span>créer nouvelle mission</span>
          </div>

          <h1 style={{ fontWeight: "300" }}>
            Nouvelle Mission
          </h1>

          <div className="mission-cards">
            <div className="mission-info-btn">
              <div className="info-mission user-page-section mb-2 mt-4">
                <h4 className="card-title">Info de Mission</h4>
                <div className="input-fields">
                  <div className="form-group form-item">
                    <label className="col-form-label">Client*</label>
                    <div>
                      <input
                        type="text"
                        value={client}
                        onChange={handleChange}
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
                        value={opCode}
                        onChange={handleChange}
                        name="opCode"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="btn btn-primary btn-success btn-add-new add-user mt-4"
                onClick={handleSubmit}
                disabled={client.length == 0}
              >
                <img src={addIcon} alt="add icon" />
                <span>Créer Mission</span>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}

export default CreateMission;
