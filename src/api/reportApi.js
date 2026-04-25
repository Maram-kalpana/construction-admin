import axios from "axios";

const api = axios.create({
  baseURL: "https://construction-api.easybizcart.com/public/api",
});

export const getReports = () => {
  return api.get("/manager/labours/reports");
};