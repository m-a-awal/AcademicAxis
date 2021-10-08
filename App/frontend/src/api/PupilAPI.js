import axios from "axios";

const host = "http://localhost:3000/";
var url;

// APIs for User management Tab
export async function getClassname(pid, token){
  url = host + "classname/" + pid;
  try{
    const response = await  axios.get(url,{
      headers: {
        'Authorization': token
      }
    });
    return response.data.data[0];
    
  }catch(error){
    console.log(error);
  }
}

export async function getAllClasses(pid, token){
  url = host + "pupilClasses/" + pid;
  try{
    const response = await  axios.get(url,{
      headers: {
        'Authorization': token
      }
    });
    console.log(response.data.data)
    return response.data.data;
    
  }catch(error){
    console.log(error);
  }
}

export async function getAllAssignedSubjects(pid,cid,token){
    url = host + "subject/avgGrade/" + pid + "/"+cid;
    console.log(url)
    try{
      const response = await  axios.get(url,{
        headers: {
          'Authorization': token
        }
      });
      console.log(response.data.data)
      return response.data;
    }catch(error){
      console.log(error);
    }
  }

  export async function getAllTests(sid, pid,token){
    url = host + "test-grades/?sid=" + sid + "&pid="+pid;  //test-grades/?sid=s20&pid=u2
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