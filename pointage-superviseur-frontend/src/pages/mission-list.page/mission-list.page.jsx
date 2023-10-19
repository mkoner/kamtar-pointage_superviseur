import { useEffect, useState, useMemo } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import MaterialReactTable from 'material-react-table';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { toast } from "react-toastify";


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
import Spinner from "../../components/spinner/spinner.component";
import CustomButton from "../../components/custom-button/custom-button.component";;

function MissionList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { loggedInUser, users } = useSelector((state) => state.auth);
  const userMessage = useSelector((state)=>state.auth.message)
  const { missions, selectedMission, isLoading, isError, message } =
    useSelector((state) => state.missions);

  useEffect(() => {
    if (isError)
      toast.error(message)
    
    if (!loggedInUser || userMessage == "Not authorized") {
      navigate("/login");
    }

    if (loggedInUser && loggedInUser.role == "Superviseur") {
      dispatch(  getMissionsBySup(loggedInUser.id));
    } else if (loggedInUser && loggedInUser.role != "Superviseur"){
      dispatch(getAllMissions());
    }

    

    return () => {
      dispatch(reset());
    };
  }, [loggedInUser, message, dispatch]);


  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmer suppression ',
      message: 'Voulez-vous vraiment supprimer cette mission?',
      buttons: [
        {
          label: 'OUI',
          onClick: () => dispatch(deleteMission(id))
        },
        {
          label: 'NON',
          onClick: () => console.log("No")
        }
      ]
    });

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
        header: "Opération",
        accessorFn: (row) => row.code_operation,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },
        maxSize: 10,
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
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },
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
        muiTableHeadCellFilterTextFieldProps: { placeholder: '' },  
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
            onClick={(evt) => { handleDelete(cell.getValue())}}
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
  };

  const handleClickClose = () => {
    setDisplayNav(false);
  };

  if (isLoading) {
    return <Spinner/>
  }
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
 {      loggedInUser && loggedInUser.role == "Superviseur" && <div
          className={`btn btn-primary btn-success btn-add-new add-user`}
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
        </div>}
      </div>

        <div className="missions">

          
        <MaterialReactTable columns={columns1} data={missions}
            enableTopToolbar={false}
            initialState={{
              showColumnFilters: true,
              pagination: { pageSize: 20, pageIndex: 0 },
            }}
            onPaginationChange={setPagination}
            state={{ pagination }}
            showProgressBars
            icons={{
              FilterListIcon: CustomButton,
              FilterListOffIcon: CustomButton,
            }}
            enableColumnActions={false}

            muiTableBodyRowProps={({ row }) => ({
              onClick: (event) => {
                if(event.target.cellIndex != undefined)
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
