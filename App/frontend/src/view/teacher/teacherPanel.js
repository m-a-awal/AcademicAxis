import React from "react";
import { checkUserType } from "../../api/APIUtils";
import { getSubjectDetails, getTestDetails } from "../../api/TeacherAPI";
import "react-tabs/style/react-tabs.css";

var redirectpath = '/manageTestpanel';
const redirectloginpath = "/login";

export default class teacherPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tid: this.props.location.state.uid,
      subjectsDetails: [],
      token: this.props.location.state ? this.props.location.state.token : "",
      t_firstn:this.props.location.state.t_firstn,
      t_lastn:this.props.location.state.t_lastn
    };
    this.loadFillData = this.loadFillData.bind(this);
    this.logoutAction = this.logoutAction.bind(this);
    this.tabSelectionAction = this.tabSelectionAction.bind(this);
    this.getAllSUbjectsOfTeacher = this.getAllSUbjectsOfTeacher.bind(this);
    this.openTestManager = this.openTestManager.bind(this);
  }

  componentDidMount() {
    var that = this;
    var tid = that.state.tid;
    var token = that.state.token;
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }
    checkUserType("token " + token).then((res) => {
      if (res) {
        if (res.status === "FAILED") that.props.history.push("/");
        return;
      }
      else {
        that.props.history.push("/");
        return;
      }
    });
    that.getAllSUbjectsOfTeacher(tid, token);
  }

  render() {
    return (
      <div>
        <div className="fill-window">
          <div className='main-title-area' style={{ paddingBottom: '10px' }}>
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
               <button type="button" style={{margin:'5px 0 0 0'}} className="btn" onClick={this.logoutAction}>Logout</button>
            </div>
          </div>
          <div className='tab-area' style={{backgroundColor:'#f9fbfd'}}>
            <h4 style={{ color: '#8c8c8c', textAlign: 'center', margin: '10px auto' }}>Manage Test</h4>
            <div className="box-container" style={{justifyContent: 'center' }}>
            <div className="table-box">
              <div className="ag-theme-alpine data-table">
                <div className="table-scroll">
                  <table className="table table-hover">
                    <thead className="thead-light">
                      <tr key={"user_key1"}>
                        <th scope="col">Class</th>
                        <th scope="col">Subjects</th>
                        <th scope="col">Manage Test</th>
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
        </div>
      </div>
    );
  }

  loadFillData() {
    var that = this;
    if (that.state.subjectsDetails.length) {
      return this.state.subjectsDetails.map((data, idx) => {
        return (
          <tr key={data.sid}>
            <th>{data.classname}</th>
            <th>{data.subjectname}</th>
            <td>{<button className="btn p-0" onClick={() => this.openTestManager(data)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hammer" viewBox="0 0 16 16">
                <path d="M9.972 2.508a.5.5 0 0 0-.16-.556l-.178-.129a5.009 5.009 0 0 0-2.076-.783C6.215.862 4.504 1.229 2.84 3.133H1.786a.5.5 0 0 0-.354.147L.146 4.567a.5.5 0 0 0 0 .706l2.571 2.579a.5.5 0 0 0 .708 0l1.286-1.29a.5.5 0 0 0 .146-.353V5.57l8.387 8.873A.5.5 0 0 0 14 14.5l1.5-1.5a.5.5 0 0 0 .017-.689l-9.129-8.63c.747-.456 1.772-.839 3.112-.839a.5.5 0 0 0 .472-.334z"></path>
              </svg>
              </button>}</td>
          </tr>
        );
      });
    }
  }

  openTestManager(data) {
    var that = this;
    getTestDetails(data.sid, that.state.token).then(response => {
      that.props.history.push({
        pathname: redirectpath,
        state: {
          info: data,
          token: that.state.token,
          uid: that.state.tid,
          t_firstn:that.state.t_firstn,
          t_lastn:that.state.t_lastn,
          testList: response.data,
          selectedTest: response.data.length ? response.data[0].tid : null,
        }
      })
    })


  }

  logoutAction() {
    var that = this;
    that.setState({ token: "" }, () => {
      that.props.history.push({ pathname: redirectloginpath });
    });
  }

  tabSelectionAction(idx) {
    this.setState({ selectedTab: idx });
  }

  getAllSUbjectsOfTeacher(tid, token) {
    getSubjectDetails(tid, "Token " + token).then((data) => {
      this.setState({ subjectsDetails: data.data });
    });
  }
}
