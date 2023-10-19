import { useEffect, useState, useMemo } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MaterialReactTable from 'material-react-table';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { getUsersByRole, deleteUser, reset } from "../../features/authSlice";

import Navigation from "../navigation.page/navigation.page";
import Logo from "../../components/logo/logo";

import deleteIcon from "../../assets/delete.svg";
import addIcon from "../../assets/icon-add-white.svg";

import "./user-list.scss";
import Spinner from "../../components/spinner/spinner.component";
import CustomButton from "../../components/custom-button/custom-button.component";

function UserList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loggedInUser, users, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!loggedInUser || message == "Not authorized") {
      navigate("/login");
    }

    if(loggedInUser)
    dispatch(getUsersByRole("Superviseur"));

    return () => {
      dispatch(reset());
    };
  }, [loggedInUser, isError, message, dispatch]);

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmer suppression ',
      message: 'Voulez-vous vraiment supprimer cet superviseur?',
      buttons: [
        {
          label: 'OUI',
          onClick: () => dispatch(deleteUser(id))
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
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: true,
      },
      {
        header: "Prénom",
        accessorFn: (row) => row.prenom,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      },
      {
        header: "Nom",
        accessorFn: (row) => row.nom,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      },
      {
        header: "numéro",
        accessorFn: (row) => row.numero,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      },
      {
        header: "email",
        accessorFn: (row) => row.email,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      },
      {
        header: "Statut",
        accessorFn: (row) => row.type,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      },
      {
        header: "Actif",
        accessorFn: (row) => (row.is_active? "OUI" : "NON"),
        sortable: true,
        filterFn: "equals",
        filterSelectOptions: [
          { text: "oui", value: "OUI" },
          { text: "non", value: "NON" },
          { text: "tous", value: "" },
        ],
        filterVariant: 'select',
        size: 20,
        minSize: 10,
        maxSize: 30,
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
    <div className="users-list">
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
              to="/superviseurs"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Superviseurs
            </Link>
          </span>
        </div>
        <div className="users-list-top">
          <h4
            className="h4-kamtar"
            style={{ fontWeight: "bold", fontSize: "1.13rem" }}
          >
            Liste des Superviseurs
          </h4>
          <div className="btn btn-primary btn-success btn-add-new add-user">
            <img src={addIcon} alt="add icon" />
            <span>
              <Link
                to="/register/superviseur"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Ajouter Superviseur
              </Link>
            </span>
          </div>
        </div>
        <div className="users">
          <MaterialReactTable
            columns={columns1}
            data={users}
            enableTopToolbar={false}
            initialState={{ showColumnFilters: true, pagination: { pageSize: 20, pageIndex: 0 } }}
            onPaginationChange={setPagination} 
            state={{ pagination }}
            showProgressBars
            enableColumnActions={false}
            muiTableBodyRowProps={({ row }) => ({
              onClick: (event) => {
                if(event.target.cellIndex != undefined)
                navigate(`/superviseurs/${row.original.id}`);
              },
            })}
            muiTableHeadCellFilterTextFieldProps={{
              sx: { m: "0", width: "100%", p: "0", mt: "2" },
              variant: "standard",
              size: "small",
            }}

            icons={{
              FilterListIcon: CustomButton,
              FilterListOffIcon: CustomButton
            }}
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default UserList;
