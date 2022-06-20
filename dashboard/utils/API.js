import axios from 'axios'


const API = axios.create({
  baseURL: "https://api.covalenthq.com/v1",
});

export default API;
