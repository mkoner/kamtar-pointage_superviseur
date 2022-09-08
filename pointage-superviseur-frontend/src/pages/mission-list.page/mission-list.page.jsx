import { useEffect, useState, useMemo } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import MaterialReactTable from 'material-react-table';


import missionSlice, {
  getAllMissions,
  getMissionById,
  getMissionsBySup,
  reset,
  getAllMissionsByMonth,
  deleteMission,
} from "../../features/missionSlice";

import { getUsersByRole } from "../../features/authSlice";

import Logo from "../../components/logo/logo";
import Navigation from "../navigation.page/navigation.page";

import deleteIcon from "../../assets/delete.svg";
import addIcon from "../../assets/icon-add-white.svg";

import "./mission-list.styles.scss";

function MissionList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser, users } = useSelector((state) => state.auth);
  const { missions, selectedMission, isLoading, isError, message } =
    useSelector((state) => state.missions);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!loggedInUser) {
      navigate("/login");
    }

    if (loggedInUser.role == "Superviseur") {
      dispatch(  getMissionsBySup(loggedInUser.id));
    } else {
      dispatch(getAllMissions());
    }

    

    return () => {
      dispatch(reset());
    };
  }, [loggedInUser, isError, message, dispatch]);


  const handleDelete = (id) => {
    console.log("delete user", id);
    dispatch(deleteMission(id));
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
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },
        enableColumnFilter: false, 
       
      },
      {
        header: "Superviseurs",
        accessorFn: (row) => row.nom_superviseur,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },
      },
      {
        header: "Client",
        accessorFn: (row) => row.nom_client,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },
      },
      {
        header: "Statut",
        accessorFn: (row) => row.statut,
        sortable: true,
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'créé', value: 'créé' },
          { text: 'debut validé', value: 'debut validé' },
          { text: 'terminé', value: 'terminé' },
          { text: 'terminé validé', value: 'terminé validé' },
          { text: 'tous', value: '' },
        ],
        filterVariant: 'select',
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },
      },
      {
        header: "Date début",
        accessorFn: (row) => (row.date_debut ? new Date(row.date_debut).toLocaleDateString():""),
        sortable: true,
        enableColumnFilter: false, 
        size: 20,
        minSize: 10, 
        maxSize: 30,
      },
      {
        header: "Début validé",
        accessorFn: (row) => (row.date_debut_validation_date ? "OUI" : "NON"),
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'oui', value: 'OUI' },
          { text: 'non', value: 'NON' },
          { text: 'tous', value: '' },
        ],
        filterVariant: 'select',
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },
        minSize: 10, //min size enforced during resizing
        maxSize: 30, //max size enforced during resizing
        size: 20, //medium column
      },
      {
        header: "Date fin",
        accessorFn: (row) => (row.date_fin ? new Date(row.date_fin).toLocaleDateString(): ""),
        sortable: true,
        enableColumnFilter: false,  
        size: 20,
        minSize: 10, 
        maxSize: 30,
      },
      {
        header: "Fin validé",
        accessorFn: (row) => (row.date_fin_validation_date ? "OUI" : "NON"),
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'oui', value: 'OUI' },
          { text: 'non', value: 'NON' },
          { text: 'tous', value: '' },
        ],
        filterVariant: 'select',
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },
        minSize: 10, //min size enforced during resizing
        maxSize: 30, //max size enforced during resizing
        size: 20, //medium column
        
      },
      {
        header: null,
        accessorKey: 'id',
        enableColumnFilter: false,
        size: 10,
        Cell: ({cell}) => (
          <img
            src={deleteIcon}
            alt="delete icon"
            height="20px"
            onClick={() => handleDelete(cell.getValue())}
          />
        ),

      },
    ]
      ,
    [],
  );
  

  

  const [displayNav, setDisplayNav] = useState(false);

  const handleClickOpen = () => {
    setDisplayNav(true);
    console.log(displayNav);
  };

  const handleClickClose = () => {
    setDisplayNav(false);
    console.log(displayNav);
  };

  return (
    <div className="missions-list">
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
          <Link to="/missions" style={{ textDecoration: "none", color: "inherit" }}>
              Missions
            </Link>
          </span>
        </div>
      <div className="missions-list-top">
        <h4
          className="h4-kamtar"
          style={{ fontWeight: "bold", fontSize: "1.13rem" }}
        >
          Liste des Missions
        </h4>
        <div
          className={`btn btn-primary btn-success btn-add-new add-user ${
            loggedInUser.role != "Superviseur" ? "no-display" : ""
          }`}
        >
          <img src={addIcon} alt="add icon" />
          <span>
            <Link
              to="/create-mission"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Créer une Mission
            </Link>
          </span>
        </div>
      </div>

        <div className="missions">

          
        <MaterialReactTable columns={columns1} data={missions}
            enableTopToolbar={false}
            initialState={{ showColumnFilters: true }} 
            enableColumnActions={false}

            muiTableBodyRowProps={({ row }) => ({
              onClick: (event) => {
                console.info(row.original.id);
                navigate(`/missions/${row.original.id}`);
              },
            })}


            displayColumnDefOptions={{
              'mrt-row-numbers': {
                size: 10,
              },
              'mrt-row-expand': {
                size: 10,
              },
            }}

            muiTableHeadCellFilterTextFieldProps={{
              sx: { m: '0', width: '100%', p:'0', mt:'2', },
              variant: 'standard',
              size: 'small'
            }}
        
          />
        </div>
      <Outlet />
    </div>
    </div>
  );
  
}

export default MissionList;
