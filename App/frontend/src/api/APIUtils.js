import axios from "axios";

const host = "http://localhost:3000/";
var url;

export async function login(data) {
  url = host + "login";
  try {
    const response = await axios.post(url,data);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export async function checkUserType(token){
  url = host + "secret-route";
  try{
    const response = await  axios.get(url,{
      headers: {
        'Authorization': token
      }
    });
    return response.data;
  }catch(error){
    console.log(error);
  }
}
