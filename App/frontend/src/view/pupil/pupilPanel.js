import React from "react";
import {checkUserType} from "../../api/APIUtils";
import Dropdown from "react-dropdown";
import {
  getClassname,
  getAllAssignedSubjects,
  getAllTests,
  getAllClasses,
} from "../../api/PupilAPI";

import PupilTestDetails from "./PupilTestDetails";
import '../../App.css';

const redirectpath = "/login";

const options = [
  {value: "ALL", label: "All Users"},
  {value: "Admin", label: "Admin"},
  {value: "Pupil", label: "Pupil"},
  {value: "Teacher", label: "Teacher"},
];

export default class pupilPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: this.props.location.state.uid,
      className: "",
      classId: "",
      allClasses: [],
      token: this.props.location.state
          ? "token " + this.props.location.state.token
          : "",
      subjectList: [],
      subjectTestDetailsList: [],
      showPopup: false,
      popupHeaderText: "",
      t_firstn:this.props.location.state.t_firstn,
      t_lastn:this.props.location.state.t_lastn
    };

    this.logoutAction = this.logoutAction.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getLoggedInClassname = this.getLoggedInClassname.bind(this);
    this.getAllSUbjects = this.getAllSUbjects.bind(this);
    this.getAllTestResult = this.getAllTestResult.bind(this);
    this.getAllPupilClasses = this.getAllPupilClasses.bind(this);
  }

  componentDidMount() {
    var that = this;
    var pid = that.state.uid;
    var token = this.props.location.state
        ? this.props.location.state.token
        : "";
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }
    checkUserType("token " + token).then((res) => {
      if (res.status === "FAILED") that.props.history.push("/");
    });
    that.getLoggedInClassname(pid, token);
    that.getAllPupilClasses(pid, token);


    //that.getLoggedInSUbjects(pid, cid, token);
  }

  render() {
    var that = this;
    return (
        <div>
          <div className="fill-window">
            <div className='main-title-area' style={{paddingBottom: '20px'}}>
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" margin="10px" fill="currentColor" class="bi bi-person-badge" viewBox="0 0 16 16">
                <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"></path>
              </svg>
              &nbsp; Pupil View</h3>
              <div style={{textAlign:'right', marginTop:'10px'}}>
                <h6> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"></path>
                  </svg>
                  &nbsp; <b>{this.state.t_firstn} {this.state.t_lastn}</b></h6>
               <button type="button" style={{margin:'5px 0 0 0'}} className="btn" onClick={this.logoutAction}>Logout</button>
              </div>
            </div>
            <div className='tab-area'  style={{backgroundColor:'#f9fbfd'}}>
              <div className="box-container">
                <div className='selection-area' style={{marginTop: '50px'}}>
                
                <div className="dropDownItem card row justify-content-center align-items-center" style={{height:'150px'}}>
                   <h5>You are in class <br/></h5>
                   <h6 style={{color:'#2c7be5'}}><b>{that.state.className} </b></h6>
                  </div>
                
                <div className="dropDownItem card row justify-content-center align-items-center" style={{marginTop:'20px', height:'200px'}}>
                    <p><b>Select a class</b></p>
                  <Dropdown
                      classname="style.dropDown"
                      options={that.state.allClasses}
                      onChange={that.getAllSUbjects}
                      placeholder="Select a class"
                      placeholderClassName="myPlaceholderClassName"
                  />
                  </div>
                </div>
                <div className="table-box" style={{marginTop: '50px'}}>
                <div className="ag-theme-alpine data-table">
                  <div className="table-scroll">
                    <table className="table table-hover">
                      <thead className="thead-light">
                      <tr key={"user_key1"}>
                        <th scope="col">Subject</th>
                        <th scope="col">Avg. Grade</th>
                        <th scope="col">Details</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.loadFillData()}
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
              </div>
            </div>
            {that.state.showPopup ? (
                <PupilTestDetails
                    subjectTestDetailsList={that.state.subjectTestDetailsList}
                    popupHeaderText={that.state.popupHeaderText}
                    closePopup={that.closePopup}
                />
            ) : null}
          </div>
        </div>
    );
  }

  logoutAction() {
    var that = this;
    that.setState({token: ""}, () => {
      that.props.history.push({pathname: redirectpath});
    });
  }

  loadFillData() {
    if (this.state.subjectList.length) {
      return this.state.subjectList.map((data) => {
         if (data.avgGrade || data.sid || data.subjectname) {
           return (
               <tr key={data.sid}>
                 <th>{data.subjectname}</th>
                 <th>{data.avgGrade}</th>
                 <td>
                   {
                     <button
                         className="btn p-0"
                         onClick={() => this.openDetailsPopup(data)}
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-view-list" viewBox="0 0 16 16">
                        <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2zm0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14z"></path>
                      </svg>
                     </button>
                   }
                 </td>
               </tr>
           );
         }
      });
    }
  }

  openDetailsPopup(data) {
    var that = this;
    that.setState({popupHeaderText: "Test Details for " + data.subjectname});
    getAllTests(data.sid, that.state.uid, that.state.token).then((data) => {
      that.setState(
          {
            subjectTestDetailsList: data.data,
          },
          () => {
            that.togglePopup();
          }
      );
    });
  }

  closePopup() {
    this.setState(
        {
          popupHeaderText: "",
          // subjectTestDetailsList:[]
        },
        () => {
          this.togglePopup();
        }
    );
  }

  togglePopup() {
    this.setState({showPopup: !this.state.showPopup});
  }

  getLoggedInClassname(pid, token) {
    getClassname(pid, "Token " + token).then((data) => {
      this.setState({className: data.classname, classId: data.cid}, () => {
        console.log(this.state.classId)
      });
    });
  }


  getAllPupilClasses(pid, token) {
    var tempList = [];
    getAllClasses(pid, "Token " + token).then((data) => {
      console.log(data)
      data.forEach((info) => {
        var obj = {value: info.cid, label: info.classname};
        tempList.push(obj);
      });
      this.setState({allClasses: tempList});
    });
  }

  getAllSUbjects(e) {
    var cid = e.value;
    var pid = this.state.uid;
    var token = this.state.token;
    getAllAssignedSubjects(pid, cid, token).then((data) => {
      this.setState({subjectList: data.data});
    });
  }

  getAllTestResult(sid, pid, token) {
    getAllTests(sid, pid, "Token " + token).then((data) => {
      this.setState({subjectTestDetailsList: data.data});
    });
  }
}
