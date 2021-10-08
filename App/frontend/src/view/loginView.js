import React from 'react'
import { login } from "../api/APIUtils";
import './loginView.css';

const redirectadminpath = '/adminpanel';
const redirectteacherpath = '/teacherpanel';
const redirectpupilpath = '/pupilpanel';

class loginView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.loginAction = this.loginAction.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  loginAction() {
    var that = this;
    var data = {
      'username': that.state.username,
      'password': that.state.password
    }
    login(data).then(response => {
      
      if (response.status === 'SUCCESS') {
        if (response.role === "Admin") that.props.history.push({ pathname: redirectadminpath, 
                                                                 state: { 
                                                                    token: response.token, 
                                                                    uid:  response.uid,
                                                                    t_firstn:response.firstname,
                                                                    t_lastn:response.lastname
                                                                  } });
        else if (response.role === "Teacher") that.props.history.push({ pathname: redirectteacherpath, 
                                                                        state: { 
                                                                          token: response.token, 
                                                                          uid: response.uid, 
                                                                          t_firstn:response.firstname,
                                                                          t_lastn:response.lastname 
                                                                        } });
        else that.props.history.push({ pathname: redirectpupilpath, 
                                       state: { 
                                          token: response.token,
                                          uid: response.uid, 
                                          t_firstn:response.firstname,
                                          t_lastn:response.lastname  
                                      } });

      }
      else alert("Login falied!")
    }).catch(err => { console.log(err) });

  }

  onChangeHandler(e) {
    if (e.target.name === 'username') {
      this.setState({ username: e.target.value })
    }
    else {
      this.setState({ password: e.target.value })
    }
  }

  render() {
    return (
      <div className="fill-window-login">
        <div className="title-area">
          <svg xmlns="http://www.w3.org/2000/svg" style={{color:'#fff'}} width="50" height="50" fill="currentColor" class="bi bi-book-half" viewBox="0 0 16 16">
            <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"></path>
          </svg>
          <h1 style={{color:'#fff'}}>AcademicAxis</h1>
        </div>
        <div className="login-area container p-33 border" style={{backgroundColor:'#fff'}}>
          <div className="form-group">
            <h2>Login</h2>
            <br />
            <label for="username">Username</label>
            <input type='text' className="form-control" name='username' id="username" onChange={this.onChangeHandler} />
            <label for="password">Password</label>
            <input type='password' className="form-control" name='password' id="password"   onChange={this.onChangeHandler} />
            <br />
            <button class="btn btn-primary" onClick={this.loginAction}>Login</button>
          </div>
        </div>
      </div>
    )
  }
}



export default loginView;
