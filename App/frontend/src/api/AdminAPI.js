import axios from "axios";

const host = "http://localhost:3000/";
var url;

// APIs for User management Tab
export async function getAllUsers(token){
  url = host + "users";
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

export async function createNewUser(user, token){
  url = host + "user/";
  try{
    const response = await axios.post(url,user,{
      headers: {
        'Authorization': token
      }
    });
    return response.data
  }catch(error){
    console.log(error)
  }
}

export async function updateAUser(user, token){
  url = host + "user/"+ user.uid;
  try{
    const response = await axios.put(url, user,{
      headers: {
        'Authorization': token
      }
    });
    return response.data
  }catch(error){
    console.log(error)
  }
}

export async function checkDuplicateUsername(username, token){
  url = host + "usercheck/" + username;
  try{
    const response = await axios.get(url, {
      headers: {
        'Authorization': token
      }
    })
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error);
  }
}

export async function getUsersByRole(role, token){
  url = host + "user/getUserByRole/" + role;
  try{
    const response = await axios.get(url, {
      headers: {
        'Authorization': token
      }
    })
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error);
  }
}

export async function deleteAUser(userid, token){
  url = host + "user/" + userid;
  try{
    const response = await axios.delete(url, {
      headers: {
        'Authorization': token
      }
    })
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error);
  }
}

export async function searchPupil(str, token){
  url = host + "search-pupil/" + str;
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

export async function getPupilByClass(cid, token){
  url = host + "users/class/" + cid;
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

export async function updateAssignedPupil(uid, data, token){
  url = host + "assign-pupil/" + uid;
  try{
    const response = await  axios.put(url, data, {
      headers: {
        'Authorization': token
      }
    });
    return response.data;
  }catch(error){
    console.log(error);
  }
}

export async function assignPupil(data, token){
  url = host + "assign-pupil/";
  try{
    const response = await  axios.post(url, data, {
      headers: {
        'Authorization': token
      }
    });
    return response.data;
  }catch(error){
    console.log(error);
  }
}



// APIs for Class management Tab
export async function getAllClass(token){
  url = host + "class/";
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

export async function getSubjectsDetails(token, cid){
  url = host + "subjects/"+cid;

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

export async function createNewClass(classObj,token){
  url = host + "class/";
  try{
    const response = await axios.post(url,classObj,{
      headers: {
        'Authorization': token
      }
    });
    return response.data
  }catch(error){
    console.log(error)
  }
}

export async function updateAClass(classObj, token){
  url = host + "class/"+ classObj.cid;

  try{
    const response = await axios.put(url, classObj,{
      headers: {
        'Authorization': token
      }
    });
    return response.data
  }catch(error){
    console.log("Error Res: "+error)
  }
}

export async function deleteAClass(cid, token){
  url = host + "class/" + cid;
  try{
    const response = await axios.delete(url, {
      headers: {
        'Authorization': token
      }
    })
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error);
  }
}

//API for Subject Management Tab

export async function getAllClassWithRemoved(token){
  url = host + "class-with-removed/";
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

export async function getSubjectClassTeacherTogether(cid, token){
  url = host + "subjects/class-teacher/"+cid;
  try{
    const response = await  axios.get(url,{
      // headers: {
      //   'Authorization': token
      // }
    });

    return response.data;
  }catch(error){
    console.log(error);
  }
}


export async function checkSubjectExists(subname, uid, cid, token){
  url = host + "subjects-exists/?subname=" + subname +"&uid="+ uid +"&cid="+cid;
  try{
    const response = await axios.get(url, {
      headers: {
        'Authorization': token
      }
    })
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error);
  }
}


export async function createSubject(sid, subname, status, uid, cid, token){
  url = host + "subject/?subjectname=" + subname +"&status="+ status +"&uid="+ uid +"&cid="+cid+"&sid="+sid;
  try{
    const response = await axios.post(url, {
      headers: {
        'Authorization': token
      }
    })
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error);
  }
}


export async function updateSubject(data, token){
  url = host + "subject/" + data.sid;
  try{
    const response = await axios.put(url, data,{
      headers: {
        'Authorization': token
      }
    });
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error);
  }
}


export async function deleteSubject(sid, token){
  url = host + "subject/" + sid;
  try{
    const response = await axios.delete(url, {
      headers: {
        'Authorization': token
      }
    })
    console.log(response);
    return response.data;
  }catch(error){
    console.log(error);
  }
}
