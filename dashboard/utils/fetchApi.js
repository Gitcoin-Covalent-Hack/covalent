import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const baseUrl = "https://api.covalenthq.com";

export const fetchApi = async (url) => {
  const response = await axios.get((url), {
    params : {
      key: process.env.COVALENT_KEY,
    },
    headers : {
      Accept: "application/json"
    }
  })
  // .then((response) => {
  //   /**
  //    * The 'then' method is executed only when the request is successfull.
  //    */
  //   // JSON.stringify(response.data);
  //   const data = response.data.data;
  //   console.log(response.data);
  //   console.log(data);
  // })
  // .catch((err) => {
  //   /**
  //    * The 'catch' method is executed only when the request fails to complete.
  //    */
  //   console.log(err);
  // });

  return response.data.data;

}