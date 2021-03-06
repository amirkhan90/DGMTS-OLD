/**
 =========================================================
 * Material Dashboard 2 React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { getProjects, projectSelector } from "redux/reducers/projects";
import { userSelector } from "../../redux/reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getEmployees, employeeSelector } from "redux/reducers/employee";
import { getTasks } from "redux/reducers/tasks";
import { tasksSelector, clearState } from "redux/reducers/tasks";
import { useNavigate } from "react-router-dom";

function Tables(props) {
  const [projectRow, setProjectRow] = useState([]);
  const [employeeRow, setEmployeeRow] = useState([]);
  const [tasksRow, setTasksRow] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { projects } = useSelector(projectSelector);
  const { employee } = useSelector(employeeSelector);
  const [firstLoad, setFirstLoad] = useState(false);
  const { tasks, isFetching, isSuccess, isError, errorMessage, successMessage } =
    useSelector(tasksSelector);

  const notify = (message) => toast(message);
  useEffect(() => {
    if (isSuccess) {
      notify(successMessage);
      dispatch(getTasks({ token }));
      dispatch(clearState());
    }
    if (isError) {
      notify(errorMessage);
      dispatch(clearState());
      if (errorMessage === "jwt session expired,Please login again") {
        alert("logged in again");

        localStorage.clear();
        navigate("/authentication/sign-in");
      }
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    projects?.length === 0 && firstLoad === false && dispatch(getProjects({ token }));
    setFirstLoad(true);
    setProjectRow(projects);
  }, [projects, firstLoad]);

  useEffect(() => {
    employee.length === 0 && firstLoad === false && dispatch(getEmployees({ token }));
    setFirstLoad(true);
    setEmployeeRow(employee);
  }, [employee, firstLoad]);

  useEffect(() => {
    tasks.length === 0 && firstLoad === false && dispatch(getTasks({ token }));
    setFirstLoad(true);
    setTasksRow(tasks);
  }, [tasks, firstLoad]);
  const getRows = () => {
    let rows;
    let columns;
    if (props?.title === "Tasks") {
      rows = tasksRow && tasksRow;
      columns = [
        {
          Header: "ID",
          accessor: "task_id",
          align: "left",
          options: {
            display: false,
          },
        },
        { Header: "Task Title", accessor: "task_title", align: "left" },
        { Header: "Task Description", accessor: "task_description", align: "center" },
        { Header: "Project Manager", accessor: "project_manager", align: "center" },
        { Header: "Start Date", accessor: "start_date", align: "center" },
        { Header: "Project Title", accessor: "project_title", align: "center" },
        { Header: "Action", align: "center" },
      ];
    }
    if (props?.title === "Projects") {
      columns = [
        { Header: "ID", accessor: "id", align: "left", hide: true },
        { Header: "Name", accessor: "title", align: "left" },
        { Header: "Description", accessor: "description", align: "left" },
        { Header: "Site Location", accessor: "site_address", align: "center" },
        { Header: "Contact Number", accessor: "site_contact", align: "center" },
        { Header: "Action", align: "center" },
      ];
      rows = projectRow && projectRow;
    }
    if (props?.title === "Employees") {
      columns = [
        { Header: "ID", accessor: "id", align: "left", hide: true },
        { Header: "Name", accessor: "name", align: "left" },
        { Header: "Email", accessor: "email", align: "left" },
        { Header: "Contact", accessor: "contact", align: "center" },
        { Header: "Role", accessor: "role", align: "center" },
        // { Header: "Report", accessor: "Report", align: "center" },
        { Header: "Action", align: "center" },
      ];
      rows = employeeRow && employeeRow;
    }

    return { rows, columns };
  };
  const columns = getRows().columns;
  const rows = getRows().rows;

  // let test = projectRow.length > 0 ? projectRow : rows;
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {isFetching ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Card>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    noEndBorder={false}
                    pagination={true}
                    canSearch={true}
                    showTotalEntries={true}
                    title={props.title}
                  />
                  <ToastContainer />
                </MDBox>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Tables;
