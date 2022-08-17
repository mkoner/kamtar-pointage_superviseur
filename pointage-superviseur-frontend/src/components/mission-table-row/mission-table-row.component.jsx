import "./mission-table-row.styles.scss";

const MissionTableRow = (props) => {
  const {
    id,
    nom_client,
    date_debut,
    date_debut_validation_date,
    date_fin,
    date_fin_validation_date,
    } = props.mission;
  const dateDebutValide = date_debut_validation_date ? "Yes" : "No";
  const dateFinValide = date_fin_validation_date ? "Yes" : "No";
    return (
      <tr className="mission-row">
        <td>{id}</td>
        <td>{nom_client}</td>
        <td>{date_debut}</td>
        <td>{dateDebutValide}</td>
        <td>{date_fin}</td>
        <td>{dateFinValide}</td>
      </tr>
  );
};
export default MissionTableRow;
