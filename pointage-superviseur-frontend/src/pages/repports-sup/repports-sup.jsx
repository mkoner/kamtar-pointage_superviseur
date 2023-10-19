import { useEffect, useState, useMemo } from "react";
import { useNavigate, Outlet, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MaterialReactTable from "material-react-table";
import { toast } from "react-toastify";
import { DateRangePicker, AutoComplete } from "rsuite";
import * as XLSX from "xlsx";

import { getRepportsBySup, reset } from "../../features/repportSlice";
import { getUserById } from "../../features/authSlice";

import Navigation from "../navigation.page/navigation.page";
import Logo from "../../components/logo/logo";

import "./repports-sup.scss";
import Spinner from "../../components/spinner/spinner.component";
import CustomButton from "../../components/custom-button/custom-button.component";

const RepportSup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { loggedInUser, users, selectedUser } = useSelector(
    (state) => state.auth
  );
  const { supData, isError, message, isSuccess, isLoading, filterDates } =
    useSelector((state) => state.repports);

  const userMessage = useSelector((state) => state.auth.message);

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [filterPeriod, setFilterPeriod] = useState(
    filterDates ? filterDates : [firstDay, lastDay]
  );

  const [displayNav, setDisplayNav] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!loggedInUser || userMessage == "Not authorized") {
      navigate("/login");
    }

    const data = {
      endDate: filterPeriod[1],
      startDate: filterPeriod[0],
      supId: id,
    };
    if (loggedInUser) {
      dispatch(getRepportsBySup(data));
      dispatch(getUserById(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [loggedInUser, isError, message, dispatch]);

  const handleClickOpen = () => {
    setDisplayNav(true);
  };

  const handleClickClose = () => {
    setDisplayNav(false);
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
        header: "Opération",
        accessorFn: (row) => row.operation,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Client",
        accessorFn: (row) => row.client,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Statut",
        accessorFn: (row) => row.statut,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        filterFn: "equals",
        filterSelectOptions: [
          { text: "créé", value: "créé" },
          { text: "debut validé", value: "debut validé" },
          { text: "terminé", value: "terminé" },
          { text: "terminé validé", value: "terminé validé" },
          { text: "tous", value: "" },
        ],
        filterVariant: "select",
        size: 20,
        minSize: 10,
        maxSize: 30,
      },
      {
        header: "Debut",
        accessorFn: (row) => row.debut,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Date Validation Debut",
        accessorFn: (row) => row.debutValide,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
        size: 20,
        minSize: 10,
        maxSize: 30,
      },
      {
        header: "Fin",
        accessorFn: (row) => row.fin,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Date Validation Fin",
        accessorFn: (row) => row.finValide,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Durée Inclus periode",
        accessorFn: (row) => row.dureeInclusPeriode,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
        size: 20,
        minSize: 10,
        maxSize: 30,
      },
      {
        header: "Durée de Mission",
        accessorFn: (row) => row.dureeTotal,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
        maxSize: 30,
      },
    ],
    []
  );

  var duree = 0;

  supData.map((item) => {
    if (item.dureeTotal) return (duree += parseInt(item.dureeTotal));
  });

  var duree1 = 0;

  supData.map((item) => {
    if (item.dureeInclusPeriode)
      return (duree1 += parseInt(item.dureeInclusPeriode));
  });

  const nbValide = supData.filter(
    (item) => item.statut == "terminé validé"
  ).length;

  const table1 = [
    [
      "Période",
      `${filterPeriod[0].toLocaleDateString()} au ${filterPeriod[1].toLocaleDateString()}`,
    ],
    ["Nombre de missions", supData.length],
    ["Nombre de missions validées", nbValide],
    ["Durée Total des mission", duree],
    ["Durée inclus dans perode chosie", duree1],
    ["Superviseur", `${selectedUser.prenom} ${selectedUser.nom}`],
  ];

  const table2 = document.getElementById("table2");

  const downloadExcel = (data) => {
    //const worksheet = XLSX.utils.json_to_sheet(data);
    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.table_to_sheet(table2, { origin: "A10" });
    //const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.utils.sheet_add_aoa(worksheet, data, { origin: "A1" });
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "rapportMissionsSup.xlsx");
  };

  const Calendar = {
    sunday: "Dim",
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mer",
    thursday: "Jeu",
    friday: "Ven",
    saturday: "Sat",
    ok: "OK",
    today: "Auj",
    yesterday: "Hier",
    last7Days: "7 derniers jours",
    hours: "Heures",
    minutes: "Minutes",
    seconds: "Secondes",
    /**
     * Format of the string is based on Unicode Technical Standard #35:
     * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     **/
    formattedMonthPattern: "MMM yyyy",
    formattedDayPattern: "dd MMM yyyy",
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="reports">
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
              to="/repports"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Rapports
            </Link>
          </span>
          <span>&nbsp;&#62;&nbsp;</span>
          <span>
            Rapport superviseur {`${selectedUser.prenom} ${selectedUser.nom}`}
          </span>
        </div>
        <div className="missions-list-top">
          <h4
            className="h4-kamtar h4-repports"
            style={{ fontWeight: "bold", fontSize: "1.13rem" }}
          >
            Rapports des Missions Superviseur:{" "}
            {`${selectedUser.prenom} ${selectedUser.nom}`}
          </h4>
          <div className="date-picker">
            <DateRangePicker
              onOk={(value) => {
                const data = {
                  endDate: value[1],
                  startDate: value[0],
                  supId: id,
                };
                dispatch(getRepportsBySup(data));
              }}
              onChange={(value) => {
                setFilterPeriod(value);
                dispatch(getRepportsBySup(value));
              }}
              character=" au "
              format="dd-MM-yyyy"
              preventOverflow={true}
              defaultValue={[filterPeriod[0], filterPeriod[1]]}
              locale={Calendar}
            />
          </div>
          <div
            className="btn btn-primary btn-success btn-add-new add-user mb-4"
            onClick={() => downloadExcel(table1)}
          >
            <i
              className="bi bi-download"
              style={{ color: "white", fontSize: "1rem" }}
            ></i>
            <span>Exporter</span>
          </div>
          <div className="repports-recap mb-4">
            <table id="table1">
              <tbody>
                <tr>
                  <td>Période</td>
                  <td>
                    {filterPeriod[0].toLocaleDateString()} au{" "}
                    {filterPeriod[1].toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td>Nombre de missions</td>
                  <td>{supData.length}</td>
                </tr>
                <tr>
                  <td>Nombre de missions validées</td>
                  <td>{nbValide}</td>
                </tr>
                <tr>
                  <td>Durée Total des mission</td>
                  <td>{duree}</td>
                </tr>
                <tr>
                  <td>Durée inclus dans perode chosie</td>
                  <td>{duree1}</td>
                </tr>
                <tr>
                  <td>Superviseur</td>
                  <td>{`${selectedUser.prenom} ${selectedUser.nom}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="missions" id="table2">
          <MaterialReactTable
            columns={columns1}
            data={supData}
            enableTopToolbar={false}
            enableColumnActions={false}
            initialState={{
              showColumnFilters: true,
              pagination: { pageSize: 20, pageIndex: 0 },
            }}
            onPaginationChange={setPagination}
            state={{ pagination }}
            showProgressBars
            muiTableBodyRowProps={({ row }) => ({
              onClick: (event) => {},
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
            icons={{
              FilterListIcon: CustomButton,
              FilterListOffIcon: CustomButton,
            }}
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default RepportSup;
