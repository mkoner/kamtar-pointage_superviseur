import { useEffect, useState, useMemo } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MaterialReactTable from "material-react-table";
import { toast } from "react-toastify";
import { DateRangePicker, AutoComplete } from "rsuite";
import * as XLSX from "xlsx";

import {
  getRepports,
  reset,
  setFilterDates,
  getPDFData,
} from "../../features/repportSlice";
import { getUsersByRole } from "../../features/authSlice";

import Navigation from "../navigation.page/navigation.page";
import Logo from "../../components/logo/logo";

import "./repports.css";
import Spinner from "../../components/spinner/spinner.component";
import CustomButton from "../../components/custom-button/custom-button.component";

const Repports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { loggedInUser, users } = useSelector((state) => state.auth);
  const { data, isError, message, isSuccess, selectedUser, isLoading, pdf } =
    useSelector((state) => state.repports);
  const userMessage = useSelector((state) => state.auth.message);

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [filterPeriod, setFilterPeriod] = useState([firstDay, lastDay]);

  const [displayNav, setDisplayNav] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!loggedInUser || userMessage == "Not authorized") {
      navigate("/login");
    }

    const data = {
      endDate: new Date(lastDay),
      startDate: new Date(firstDay),
    };
    if (loggedInUser) {
      dispatch(getRepports(data));

      dispatch(getUsersByRole("Superviseur"));
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
        header: "Superviseur",
        size: 10,
        maxSize: 10,
        accessorFn: (row) => row.nom,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Nombre de Mission",
        accessorFn: (row) => row.nbTotal,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Missions Terminéés",
        accessorFn: (row) => row.nbTermine,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Missions Validées",
        accessorFn: (row) => row.nbValide,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
      },
      {
        header: "Durée Totale",
        accessorFn: (row) => row.missionDays,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
        size: 20,
        minSize: 10,
        maxSize: 30,
      },
      {
        header: "Durée Inclus",
        accessorFn: (row) => row.daysInRange,
        sortable: true,
        muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
        enableColumnFilter: false,
        size: 20,
        minSize: 10,
        maxSize: 30,
      },
    ],
    []
  );

  const downloadPDF = async () => {
    const data = {
      endDate: filterPeriod[1],
      startDate: filterPeriod[0],
    };
    const month = filterPeriod[1].toLocaleString('default', { month: 'long' });
    const year = filterPeriod[1].getFullYear()
    await dispatch(getPDFData(data))
    const url = window.URL.createObjectURL(
      new Blob([pdf]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `pointage-${month}-${year}.pdf`,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  }

  const table = document.getElementById("table");
  const downloadExcel = (data) => {
    var worksheet = XLSX.utils.table_to_sheet(table, { origin: "A1" });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "rapportMissions.xlsx");
  };

  const autoList = users.map(
    (user) => user.id + " " + user.prenom + " " + user.nom
  );

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
        </div>
        <div className="missions-list-top">
          <h4
            className="h4-kamtar h4-repports"
            style={{ fontWeight: "bold", fontSize: "1.13rem" }}
          >
            Rapports des Missions
          </h4>
          <div className="autocomplete">
            <span>Superviseur</span>
            <AutoComplete
              data={autoList}
              style={{ width: 224 }}
              onSelect={(item, evt) => {
                const id = item.split(" ")[0];
                navigate(`/repports/${id}`);
              }}
            />
          </div>
          <div className="date-picker">
            <DateRangePicker
              onOk={(value) => {
                const data = {
                  endDate: value[1],
                  startDate: value[0],
                };
                dispatch(getRepports(data));
              }}
              onChange={(value) => {
                setFilterPeriod(value);
                dispatch(setFilterDates(value));
              }}
              character=" au "
              format="dd-MM-yyyy"
              preventOverflow={true}
              defaultValue={[filterPeriod[0], filterPeriod[1]]}
            />
          </div>

          <div
            className="btn btn-primary btn-success btn-add-new add-user mb-4"
            onClick={() => downloadExcel(data)}
          >
            <i
              className="bi bi-download"
              style={{ color: "white", fontSize: "1rem" }}
            ></i>
            <span>Exporter</span>
          </div>

          <div
            className="btn btn-primary btn-success btn-add-new add-user mb-4 ml-4"
            onClick={downloadPDF}
          >
            <i
              className="bi bi-download"
              style={{ color: "white", fontSize: "1rem" }}
            ></i>
            <span>Exporter PDF</span>
          </div>
        </div>

        <div className="missions" id="table">
          <MaterialReactTable
            columns={columns1}
            data={data}
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
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Repports;
