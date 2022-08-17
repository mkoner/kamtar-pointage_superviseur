import React from "react";
import CustomButton from "../../components/custom-button/custom-button.component";

import "./mission.page.scss";

class MissionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mission-page">
        <h2>Détails de mission</h2>
        <div className="date-debut-container date-container container">
          <h3>Début de mission</h3>
          <div className="date-debut date">
            <div className="date-label">
              Date de début de la mission
              <input type="date" />
            </div>
            <div className="buttons">
              <CustomButton type="submit"> Valider date début </CustomButton>
            </div>
          </div>
          <div className="detail-validation">
            <h4>Détails de validation</h4>
            <p className="valide-par">Validé par:</p>
            <p className="date-validation">Date de validation:</p>
          </div>
        </div>
        <hr />
        <div className="date-fin-container date-container container">
          <h3>Fin de mission</h3>
          <div className="date-fin date">
            <div className="date-label">
              Date de fin de la mission
              <input type="date" />
            </div>
            <div className="buttons">
              <CustomButton type="submit"> Valider date fin </CustomButton>
            </div>
          </div>
          <div className="detail-validation">
            <h4>Détails de validation</h4>
            <p className="valide-par">Validé par:</p>
            <p className="date-validation">Date de validation:</p>
          </div>
        </div>
      </div>
    );
  }
}

export default MissionPage;
