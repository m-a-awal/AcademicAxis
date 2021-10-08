import React from 'react';
import Dropdown from "react-dropdown";
import {
  getAllUsers,
  createNewUser,
  updateAUser,
  checkDuplicateUsername,
  getUsersByRole,
  deleteAUser
} from '../../../api/AdminAPI'
import Userpopup from "./Userpopup";

import './UserTab.css'
import '../../../App.css';
import 'react-dropdown/style.css';

const options = [
  { value: 'ALL', label: 'All Users' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Pupil', label: 'Pupil' }
];

export default class UserTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list: [],
      showPopup: false,
      selectedRole: '',
      popupHeaderText: '',
      popupBtnText: '',
      userinfo: {
        fname: '',
        lname: '',
        username: '',
        uid: ''
      },
      token: "token " + this.props.token,
      uid: this.props.uid
    }
    this.loadFillData = this.loadFillData.bind(this);
    this.getAllUser = this.getAllUser.bind(this);
    this.openNewUserPopup = this.openNewUserPopup.bind(this);
    this.onRoleSelect = this.onRoleSelect.bind(this);
    this.openUpdatePopup = this.openUpdatePopup.bind(this);
    this.deleteInfo = this.deleteInfo.bind(this);
    this.togglePopup = this.togglePopup.bind(this);

    /// Popup functions
    this.addUser = this.addUser.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  componentDidMount() {
    var token = this.props.token;
    this.getAllUser("tokeon " + token);
  }

  render() {
    var that = this;
    return (
      <div>
        <h5 style={{ color: '#8c8c8c', textAlign: 'left', margin: '10px 0 10px 9.9%' }}>User Management</h5>
        <div className="box-container">
          <div className='selection-area'>
            <div className="dropDownItem card row justify-content-center align-items-center">
              <p><b>Select an user role</b></p>
              <Dropdown
                options={options}
                onChange={this.onRoleSelect}
                value={options[0]}
                placeholderClassName='myPlaceholderClassName' />
            </div>
            <div className="SecondItem card row justify-content-center align-items-center">
              <p><b>Add a new user</b></p>
              <button className="btn btn-success" onClick={this.openNewUserPopup}>Add</button>
            </div>
          </div>
          <div className="table-box">
            {that.state.list.length ?
              <div className="ag-theme-alpine data-table">
                <div className="table-scroll">
                  <table className="table table-hover">
                    <thead className="thead-light">
                      <tr key={"user_key1"}>
                        <th scope="col">Username</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Role</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.loadFillData()}
                    </tbody>
                  </table>
                </div>
              </div> : <label>No data</label>}
          </div>
          {that.state.showPopup ?
            <Userpopup userinfo={that.state.userinfo}
              selectedRole={that.state.selectedRole}
              popupHeaderText={that.state.popupHeaderText}
              popupBtnText={that.state.popupBtnText}
              updateInfo={that.updateInfo}
              addUser={that.addUser}
              closePopup={that.closePopup}
            /> : null}
        </div>
      </div>
    )
  }

  loadFillData() {
    if (this.state.list.length) {

      return this.state.list.map(data => {
        return (
          <tr key={data.uid}>
            <th>{data.username}</th>
            <td>{data.firstname}</td>
            <td>{data.lastname}</td>
            <td>{data.role}</td>
            <td>{<button className="btn p-0" onClick={() => this.openUpdatePopup(data)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
              </svg>
            </button>}</td>
            <td>{<button className="btn p-0" onClick={() => this.deleteInfo(data.uid)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
              </svg>
            </button>}</td>
          </tr>
        )
      })
    }
  }

  getAllUser(token) {
    getAllUsers(token).then(data => {
      this.setState({ list: data.data })
    })
  }

  openNewUserPopup() {
    if (this.state.selectedRole) {
      this.setState({
        popupHeaderText: "Add A New",
        popupBtnText: "Add",
        userinfo: {
          fname: "",
          lname: "",
          uid: "",
          username: ""
        }
      },
        () => {
          this.togglePopup();
        })
    } else alert("Please select a role.");

  }

  onRoleSelect(e) {
    var that = this;
    this.setState({ selectedRole: e.value !== "ALL" ? e.value : "" }, () => {
      if (e.value === 'ALL') {
        that.getAllUser(that.state.token);
      } else {

        getUsersByRole(e.value, that.state.token).then(data => {
          // if(data.status !== "FAILED")

          that.setState({ list: data.status !== "FAILED" ? data.data : [] })
        })
      }
    })
  }


  openUpdatePopup(data) {
    this.setState({
      popupHeaderText: "Update",
      popupBtnText: "Update",
      userinfo: {
        fname: data.firstname,
        lname: data.lastname,
        uid: data.uid,
        username: data.username
      },
      selectedRole: data.role
    },
      () => {
        this.togglePopup();
      })
  }

  addUser(data) {
    var that = this;
    checkDuplicateUsername(data.username, that.state.token).then(response => {
      if (!response.data.length)
        createNewUser(data, that.state.token).then(data => {
          if (data.status === "SUCCESS") {
            that.togglePopup();
            that.setState({
              list: [],
              popupHeaderText: "",
              popupBtnText: "",
              userinfo: {
                fname: "",
                lname: "",
                uid: "",
                username: ""
              },
              // selectedRole: ""
            }, () => {
              // that.getAllUser(that.state.token)
              that.onRoleSelect({ value: that.state.selectedRole })
            })
          } else {
            alert("Error!!")
          }
        })
      else alert("This username is already existed");
    })

  }

  updateInfo(data) {
    var that = this;
    updateAUser(data, that.state.token).then(response => {
      if (response.status === "SUCCESS") {
        that.togglePopup();
        that.setState({
          list: [],
          popupHeaderText: "",
          popupBtnText: "",
          userinfo: {
            fname: "",
            lname: "",
            uid: "",
            username: ""
          },
          selectedRole: ""
        }, () => {
          that.getAllUser(that.state.token)
        })
      }
    })
  }

  deleteInfo(uid) {
    var that = this;
    if (uid !== that.state.uid) {
      if (!window.confirm("Do you really want to delete it?")) return;
      deleteAUser(uid, that.state.token).then(data => {
        alert(data.message);
        that.getAllUser(that.state.token);
      })
    } else { alert("You can not delete yourself.") }
  }

  closePopup() {
    this.setState({
      popupHeaderText: "",
      popupBtnText: "",
      userinfo: {
        fname: "",
        lname: "",
        uid: "",
        username: ""
      },
      //selectedRole: ""
    },
      () => {
        this.togglePopup();
      })
  }

  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }
}
