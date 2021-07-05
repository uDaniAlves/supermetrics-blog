import axios from "axios";

const api = axios.create({
  baseURL: `https://api.supermetrics.com/assignment`,
});

export default api;