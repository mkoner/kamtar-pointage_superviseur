import MissionTableRow from "../../components/mission-table-row/mission-table-row.component";

import "./mission-list.styles.scss";

const MissionList = (props) => {
  const mission = {
    id: 1,
    sup_id: 1015,
    date_debut: "2022-08-09T18:18:00.000Z",
    date_fin: "2022-09-01T18:18:00.000Z",
    nom_client: "ABC Company",
    date_debut_validation_date: "2022-08-09T18:50:30.000Z",
    date_debut_valide_par: 1005,
    date_fin_validation_date: "2022-08-10T15:23:20.000Z",
    date_fin_valide_par: 1005,
    mois1: 7,
    duree1: 23,
    annee1: 2022,
    mois2: 8,
    duree2: 1,
    annee2: 2022,
    date_creation: "2022-08-09T15:46:50.000Z",
  };

  return (
    <div className="mission-list">
      <h2>Mission</h2>
      <div className="missions">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Date début</th>
              <th>Date début validé</th>
              <th>Date fin</th>
              <th>Date fin validé</th>
            </tr>
          </thead>
          <tbody>
                      <MissionTableRow mission={mission} />
                      <MissionTableRow mission={mission} />
                      <MissionTableRow mission={mission} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MissionList;
