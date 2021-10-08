import React from "react";
import Dropdown from "react-dropdown";
import {
  getAllClass,
  getSubjectsDetails,
  createNewClass,
  updateAClass,
  deleteAClass
} from "../../../api/AdminAPI";
import Tablepopup from "./Tablepopup";

import "./UserTab.css";
import "../../../App.css";
import "react-dropdown/style.css";

// const options = ["Pupil", "Teacher"];

export default class ClassTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subjectsDetails: [],
      allClasses: [],
      showPopup: false,
      selectedClass: "",
      popupHeaderText: "",
      popupBtnText: "",
      classinfo: {
        classname: "",
        cid: "",
      },
      token: "token " + this.props.token
    };
    this.loadFillData = this.loadFillData.bind(this);
    this.getAllClasses = this.getAllClasses.bind(this);
    this.getAllSubjectsDetails = this.getAllSubjectsDetails.bind(this);
    this.openNewClassPopup = this.openNewClassPopup.bind(this)

    //Popup functions
    this.addClass = this.addClass.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.closePopup = this.closePopup.bind(this);

  }

  componentDidMount() {
    var token = this.props.token;
    this.getAllClasses("tokeon " + token);
  }

  render() {
    var that = this;
    //console.log(that.state.allClasses);
    return (
      <div>
        <h5 style={{ color: '#8c8c8c', textAlign: 'left', margin: '10px 0 10px 9.9%' }}>Class Management</h5>
        <div className="box-container">
          <div className='selection-area'>
            <div className="dropDownItem card row justify-content-center align-items-center">
              <p><b>Select a class</b></p>
              <Dropdown
                classname="style.dropDown"
                options={that.state.allClasses}
                onChange={this.getAllSubjectsDetails}
                placeholder="Select a class"
                placeholderClassName="myPlaceholderClassName"
              />
            </div>
            <div className="SecondItem card row justify-content-center align-items-center">
              <p><b>Settings: Class</b></p>
              <button className="btn btn-success" onClick={this.openNewClassPopup}>Add</button>
              <div style={{width:'100%', marginTop:'10px'}}>
                <button className="btn" style={{width:'26%', backgroundColor:'#a3bff0',borderColor:'#a3bff0'}} onClick={() => this.openUpdatePopup(that.state.classinfo)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                  </svg>
                </button>
                <button className="btn" style={{width:'26%', marginLeft:'10px', backgroundColor:'#f0a3a7',borderColor:'#f0a3a7'}} onClick={() => this.deleteInfo(that.state.classinfo.cid)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="table-box">
            <div className="ag-theme-alpine data-table">
              <div className="table-scroll">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr key={"user_key1"}>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Teacher</th>
                    </tr>
                  </thead>
                  <tbody>{this.loadFillData()}</tbody>
                </table>
              </div>
            </div>
          </div>
          {that.state.showPopup ? (
            <Tablepopup
              classinfo={that.state.classinfo}
              selectedClass={that.state.selectedClass}
              closePopup={that.togglePopup.bind(this)}
              popupHeaderText={that.state.popupHeaderText}
              popupBtnText={that.state.popupBtnText}
              updateInfo={that.updateInfo}
              addClass={that.addClass}
            />
          ) : null}
        </div>
      </div>
    );
  }

  loadFillData() {
    if (this.state.subjectsDetails.length) {
      return this.state.subjectsDetails.map((data, idx) => {
        return (
          <tr key={idx}>
            <td>{data.subjectname}</td>
            <td>{data.status}</td>
            <td>{data.fullname}</td>
          </tr>
        );
      });
    }
  }

  getAllClasses(token) {
    var tempList = [];
    getAllClass(token).then((data) => {
      data.data.forEach((info) => {
        var obj = { value: info.cid, label: info.classname };
        tempList.push(obj);
      });
      this.setState({ allClasses: tempList });
    });
  }

  getAllSubjectsDetails(e) {
    var that = this;
    getSubjectsDetails("token " + that.props.token, e.value).then((data) => {
      var obj = {
        cid: e.value,
        classname: e.label
      }
      that.setState({ classinfo: obj, subjectsDetails: data.data })
    });
  }

  addClass(data) {
    var that = this;
    console.log(data)
    getAllClass("Token " + that.props.token).then((cinfo) => {
      console.log(cinfo.data)
      if ((cinfo.data.filter(e => e.classname === data.classname).length > 0))
        alert("The class already exists!")
      else {
        createNewClass(data, "token " + that.props.token).then((data) => {
          if (data.status === "SUCCESS") {
            that.togglePopup();
            that.setState({ allClasses: [] }, () => {
              that.getAllClasses("Token " + that.props.token);
            });
          } else {
            alert("Error!!");
          }
        });
      }
    })
  }

  updateInfo(data) {
    var that = this;
    //console.log(data)
    updateAClass(data, that.state.token).then(response => {
      if (response.status === "SUCCESS") {
        that.togglePopup();
        that.setState({
          //allClasses: [],
          popupHeaderText: "",
          popupBtnText: "",
          classinfo: {
            cid: "",
            classname: ""
          },
          allClasses: []
        }, () => {
          that.getAllClasses("Token " + that.props.token)
        })
      }
    })
  }

  openNewClassPopup() {
    this.setState(
      {
        popupHeaderText: "Add A New Class",
        popupBtnText: "Add",
      },
      () => {
        this.togglePopup();
      }
    );
  }

  openUpdatePopup(data) {
    if (data.cid === "") {
      alert("Please select a class.")
    }
    else {
      this.setState({
        popupHeaderText: "Update",
        popupBtnText: "Update",
        classinfo: {
          cid: data.cid,
          classname: data.classname
        }
      },
        () => {
          this.togglePopup();
        })
    }

  }

  closePopup() {
    this.setState({
      popupHeaderText: "",
      popupBtnText: "",
      classinfo: {
        classname: "",
        cid: ""
      },
      selectedClass: ""

    },
      () => {
        this.togglePopup();
      })
  }

  deleteInfo(cid) {
    var that = this;
    if (cid === "") {
      alert("Please select a class.")
    } else {
      if (!window.confirm("Do you really want to delete the class?")) return;
      deleteAClass(cid, that.state.token).then(data => {
        alert(data.message);
        that.getAllClasses(that.state.token);
      })

    }
  }
  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }
}
