import React from "react";

import Dropdown from "react-dropdown";
import {
  getStudentMarkDetails,
  createNewTest,
  getTestDetails,
  checkResultID,
  uploadResult,
  deleteATest,
  updateResult,
  updateATest,
  getAvgMark
} from "../../api/TeacherAPI";

import {CSVReader} from "react-papaparse";

import "../../App.css";
import ManageTestPopup from "./ManageTestPopup";
import ManageStudentTestPopup from "./ManageStudentTestPopup";

const buttonRef = React.createRef();

var redirectloginpath = "/teacherpanel"

export default class manageTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.location.state.token,
      uid: this.props.location.state.uid,
      subjectname: this.props.location.state.info.subjectname,
      sid: this.props.location.state.info.sid,
      cid: this.props.location.state.info.cid,
      classname: this.props.location.state.info.classname,
      testDetailsList: this.props.location.state.testList,
      testList: [],
      studentList: [],
      selectedTest: this.props.location.state.selectedTest,
      studentMarkData: [],
      t_firstn:this.props.location.state.t_firstn,
      t_lastn:this.props.location.state.t_lastn,

      showTestPopup: false,
      showStudentGradePopup: false,
      showPopUp: false,

      popupHeaderText: '',
      popupBtnText: '',
      studentData: '',

      testResult: [],
      tid: "",
      testname: "",
      testdate: "",
      isAvgMarks: false,
    };

    this.getAllTests = this.getAllTests.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.onTestChange = this.onTestChange.bind(this);
    this.gotoBack = this.gotoBack.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.loadStudentList = this.loadStudentList.bind(this);

    this.toggleNewTestPopup = this.toggleNewTestPopup.bind(this);
    this.toggleStudentGradePopup = this.toggleStudentGradePopup.bind(this);

    this.openStudentTestGradeUpdatePopup =
        this.openStudentTestGradeUpdatePopup.bind(this);
    this.openNewTestPopup = this.openNewTestPopup.bind(this);
    this.openUpdatePopup = this.openUpdatePopup.bind(this);

    this.closeStudentGradePopup = this.closeStudentGradePopup.bind(this);
    this.closeTestPopup = this.closeTestPopup.bind(this);
    this.uploadTestResult = this.uploadTestResult.bind(this);
    this.updateInfo = this.updateInfo.bind(this);

    this.addTest = this.addTest.bind(this);
    this.setID = this.setID.bind(this);
    this.deleteInfo = this.deleteInfo.bind(this);
    this.updateTest = this.updateTest.bind(this);
    this.showAvgMarks = this.showAvgMarks.bind(this);
  }

  showAvgMarks() {
    var that = this;
    getAvgMark(that.state.sid, that.state.cid, "Token "+ that.state.token).then(response => {
      that.setState({isAvgMarks: true, studentList: response.data, selectedTest: ""})
    })
  }

  setID() {
    return "RES" + Date.now();
  }

  uploadTestResult() {
    var that = this;
    var countRow = 0;
    if (this.state.studentMarkData.length) {
      this.state.studentMarkData.forEach((stdData, idx) => {
        checkResultID(stdData, "Tokenn " + that.state.token).then(
            (response) => {
              if (response.res.length) {
                stdData.rid = response.res[0].resid;
              } else {
                stdData.rid = that.setID() + idx;
              }

              uploadResult(stdData, "Token " + that.state.token).then(
                  (response) => {
                    if (response.status === "SUCCESS") {
                      that.loadStudentList();
                    }
                  }
              );
            }
        );
      });
    } else {
      alert("Please select a CSV file.");
    }
  }

  openUpdatePopup(data) {
    var that = this;
    if (this.state.selectedTest)
      that.setState(
          {
            popupHeaderText:
                "Update selected Test for " +
                that.state.classname +
                " - " +
                that.state.subjectname,
            popupBtnText: "Update",
          },
          () => {
            that.toggleNewTestPopup();
          }
      );
    else {
      alert("Please select a test")
    }
  }

  toggleNewTestPopup() {
    this.setState({showPopUp: !this.state.showPopUp});
  }

  closeTestPopup() {
    var that = this;
    that.setState(
        {
          popupHeaderText: "",
          popupBtnText: "",
        },
        () => {
          that.toggleNewTestPopup();
        }
    );
  }

  openNewTestPopup() {
    var that = this;
    that.setState({
      popupHeaderText: "Add A new Test for " + that.state.classname + " - " + that.state.subjectname,
      popupBtnText: "Add",
    }, () => {
      that.toggleNewTestPopup();
    })
  }

  toggleStudentGradePopup() {
    this.setState({showStudentGradePopup: !this.state.showStudentGradePopup})
  }

  closeStudentGradePopup() {
    var that = this;
    this.setState({
          popupHeaderText: '',
          popupBtnText: "",
          studentData: '',
        },
        () => {
          that.toggleStudentGradePopup();
        })
  }

  openStudentTestGradeUpdatePopup(data) {
    var that = this;
    that.setState({
      popupHeaderText: data.name + "'s test and grade update",
      popupBtnText: "Update",
      studentMarkData: data,

    }, () => {
      that.toggleStudentGradePopup();
    })
  }

  loadStudentList() {
    var that = this;
    getStudentMarkDetails(that.state.selectedTest, that.state.sid, that.state.cid , that.state.token).then(response => {
      if (response)
        if (response.data) {
          that.setState({studentList: response.data})
        }
    })
  }

  handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  handleOnRemoveFile = (data) => {
    var that = this;
    this.setState({studentMarkData: data ? data : []}, () => {
      console.log(that.state.studentMarkData);
    });
  };

  handleRemoveFile = (e) => {
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  handleOnFileLoad = (data) => {
    var that = this;
    var obj = [];
    if (data) {
      data.forEach((dt, idx) => {
        if (idx !== 0)
          obj.push({
            uid: dt.data[0],
            grade: dt.data[1],
            sid: that.state.sid,
            tid: that.state.selectedTest,
            rid: "",
          });
      });
    }
    this.setState({studentMarkData: obj}, () => {
      console.log(that.state.studentMarkData);
    });
  };

  handleOnError = (err, file, inputElem, reason) => {
  };

  componentDidMount() {
    this.getAllTests();
    this.loadStudentList();
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
              &nbsp; Teacher View</h3>
              <div style={{textAlign:'right', marginTop:'10px'}}>
                <h6> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"></path>
                  </svg>
                  &nbsp; <b>{this.state.t_firstn} {this.state.t_lastn}</b></h6>
              </div>
            </div>
            <div className='tab-area' style={{backgroundColor:'#f9fbfd'}}>
              <div className="subtitle-area">
                <button className="btn btn-text" onClick={this.gotoBack}>	&#60; Back</button>
                <h4 style={{color: '#8c8c8c', textAlign: 'center', margin: '20px auto'}}>Test Management
                  for {that.state.classname} - {that.state.subjectname}</h4>
              </div>
              <div className="box-container">
                <div className='selection-area'
                     style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <div>
                  <div className="dropDownItem card row justify-content-center align-items-center" style={{height:'200px'}}>
                    <p><b>Select a test</b></p>
                    <Dropdown
                        classname="style.dropDown"
                        value={
                          that.state.testList[
                              this.getIndex(this.state.testList, this.state.selectedTest)
                              ]
                        }
                        options={that.state.testList}
                        onChange={this.onTestChange}
                        placeholder="Select a test"
                        placeholderClassName="myPlaceholderClassName"
                    />
                    <br/>
                    <button
                        className="btn btn-primary"
                        onClick={() => this.showAvgMarks(that.state.selectedTest)}
                    >
                      View Avg. Mark
                    </button>
                  </div>
                    <div className="SecondItem card row justify-content-center align-items-center">
                    <p><b>Settings: Test</b></p>
                    <button className="btn btn-success" onClick={this.openNewTestPopup}> Add</button>
                    <div style={{width:'100%', marginTop:'10px'}}>
                    <button
                        className="btn" style={{width:'26%', backgroundColor:'#a3bff0',borderColor:'#a3bff0'}}
                        onClick={() => this.openUpdatePopup(that.state.classinfo)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                      </svg>
                    </button>
                    <button
                        className="btn" style={{width:'26%', marginLeft:'10px', backgroundColor:'#f0a3a7',borderColor:'#f0a3a7'}} 
                        onClick={() => this.deleteInfo(that.state.selectedTest)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                      </svg>
                    </button>
                    </div>
                    </div>
                    <div className="SecondItem card row justify-content-center align-items-center">
                    <p><b>Upload a CSV file</b></p>
                      <div className="upload-area">
                        <CSVReader
                            noClick
                            noDrag
                            ref={buttonRef}
                            onFileLoad={this.handleOnFileLoad}
                            onError={this.handleOnError}
                            onRemoveFile={this.handleOnRemoveFile}
                        >
                          {({file}) => (
                              <aside
                                  style={{}}
                              >
                                <button className="btn" id="browse" type="button" onClick={this.handleOpenDialog}> 
                                Browse
                                </button>
                                <div style={{}}>{file && file.name}</div>
                                <button className="btn" id="delete" type="button" onClick={this.handleRemoveFile}>
                                Remove
                                </button>
                              </aside>
                          )}
                        </CSVReader>
                        
                      </div>
                      <button className="btn btn-primary" onClick={this.uploadTestResult}>
                          Upload
                      </button>
                  </div>
                  </div>
                </div>
                <div className="table-box">
                {that.state.studentList.length ? (
                    <div className="ag-theme-alpine data-table">
                      <div className="table-scroll">
                        <table className="table table-hover">
                          <thead className="thead-light">
                          <tr key={"user_key1"}>
                            <th scope="col">Student Name</th>
                            <th scope="col">{that.state.isAvgMarks ? "Avg.Marks" : "Grade"}</th>
                            {that.state.isAvgMarks ? "" : <th scope="col">Action</th>}
                          </tr>
                          </thead>
                          <tbody>{this.loadFillData()}</tbody>
                        </table>
                      </div>
                    </div>
                ) : (
                    <div>
                      <label>No student is in this class and test</label>
                    </div>
                )}
                </div>
                {that.state.showPopUp ? (
                    <ManageTestPopup
                        testList={that.state.testList}
                        selectedTest={that.state.selectedTest}
                        popupHeaderText={that.state.popupHeaderText}
                        testDetailsList={that.state.testDetailsList}
                        sid={that.state.sid}
                        popupBtnText={that.state.popupBtnText}
                        updateTest={that.updateTest}
                        addTest={that.addTest}
                        closePopup={that.closeTestPopup}
                    />
                ) : null}

                {that.state.showStudentGradePopup ? (
                    <ManageStudentTestPopup
                        testList={that.state.testList}
                        selectedTest={that.state.selectedTest}
                        popupHeaderText={that.state.popupHeaderText}
                        studentData={that.state.studentData}
                        popupBtnText={that.state.popupBtnText}
                        studentMarkData={that.state.studentMarkData}
                        //        addUser={that.addUser}
                        updateInfo={that.updateInfo}
                        closePopup={that.closeStudentGradePopup}
                    />
                ) : null}
              </div>
            </div>
          </div>
        </div>
    );
  }

  getIndex(arr, testVal) {
    return arr.findIndex((obj) => obj.value === testVal);
  }

  gotoBack() {
    this.props.history.push({
      pathname: redirectloginpath,
      state: {token: this.state.token, uid: this.state.uid, t_firstn:this.state.t_firstn,
        t_lastn:this.state.t_lastn},
    });
  }

  onTestChange(data) {
    var that = this;
    this.setState({selectedTest: data.value, isAvgMarks: false}, () => {
      that.loadStudentList();
    });
  }

  loadFillData() {
    if (this.state.studentList.length) {
      return this.state.studentList.map((data, idx) => {
        return (
            <tr key={data.username + idx}>
              <td>{data.name}</td>
              <td>{ this.state.isAvgMarks ? data.avgGrade : data.marks}</td>
              {this.state.isAvgMarks ? "" : <td>
                {<button className="btn p-0"
                         onClick={() => this.openStudentTestGradeUpdatePopup(data)}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                        </svg>  
                </button>}
              </td>}
            </tr>
        );
      });
    }
  }

  getAllTests() {
    var tempList = [];
    var that = this;

    that.state.testDetailsList.forEach((info) => {
      var obj = {value: info.tid, label: info.testname};
      tempList.push(obj);
    });

    that.setState({testList: tempList}, () => {
    });
  }

  addTest(data) {
    var that = this;
    console.log(that.state.token);

    createNewTest(data, "Token " + that.state.token).then((data) => {
      if (data.status === "SUCCESS") {
        that.toggleNewTestPopup();
        that.setState({testList: []}, () => {
          getTestDetails(that.state.sid, "Token " + that.props.token).then(
              (response) => {
                that.setState({testDetailsList: response.data}, () => {
                  that.getAllTests();
                });
              }
          );
        });
      } else {
        // alert("Error!!");
      }
    });

  }

  updateTest(data) {
    console.log(data);
    var that = this;
    //console.log(data)
    updateATest(data, "Token " + that.state.token).then((response) => {
      if (response.status === "SUCCESS") {
        that.toggleNewTestPopup();
        that.setState({testList: []}, () => {
          getTestDetails(that.state.sid, "Token " + that.props.token).then(
              (response) => {
                that.setState({testDetailsList: response.data}, () => {
                  that.getAllTests();
                });
              }
          );
        });
      } else {
        alert("Error!!");
      }
    });
  }

  deleteInfo(data) {
    var that = this;
    console.log(data);
    if (this.state.selectedTest) {
      if (!window.confirm("Do you really want to delete the class?")) return;
      deleteATest(data, "Token " + that.state.token).then((data) => {
        alert(data.message);
        if (data.status === "SUCCESS") {
          that.setState({testList: []}, () => {
            getTestDetails(that.state.sid, "Token " + that.props.token).then(
                (response) => {
                  that.setState({testDetailsList: response.data, selectedTest: null}, () => {
                    that.getAllTests();
                  });
                }
            );
          });
        } else {
          alert("Error!!");
        }
      });
    } else {
      alert("Please select a test to delete")
    }
  }

  updateInfo(data) {
    var that = this;
    var result = {
      rid: data.resid,
      sid: this.state.sid,
      tid: this.state.selectedTest,
      uid: data.uid,
      grade: data.marks,
    };
    updateResult(result, that.state.token).then((response) => {
      console.log(response);
      if (response.status === "SUCCESS") {
        that.toggleStudentGradePopup();
        that.setState({}, () => {
          that.loadStudentList();
        });
      } else {
        alert(response.message);
      }
    });
  }
}
