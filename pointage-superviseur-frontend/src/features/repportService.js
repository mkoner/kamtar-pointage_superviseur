import axios from "axios";

import { DEV_URL } from "../constants";

//get repports for all Sups
const getRepport = async (reqData, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.post(`${DEV_URL}repports`, reqData, config);
  return response.data;
};

//get repports for all Sups
const getRepportBySup = async (reqData, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.post(`${DEV_URL}repports/sup`, reqData, config);
  return response.data;
};

//Export PDF
const getPDFData = async (reqData, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
    responseType: "blob"

  };

  const response = await axios.post(`${DEV_URL}repports/pdf`, reqData, config);
  return response.data;
};

const RepportService = {
  getRepport,
  getRepportBySup,
  getPDFData
};


export default RepportService;
