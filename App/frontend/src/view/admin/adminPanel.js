import React from 'react'
import {checkUserType} from "../../api/APIUtils";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import UserTab from './Component/UserTab'
import SubjectTab from './Component/SubjectTab'
import PupilTab from './Component/PupilTab'

import 'react-tabs/style/react-tabs.css';
import ClassTable from './Component/ClassTable';

const redirectpath = '/login';

export default class adminPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      token: this.props.location.state ? this.props.location.state.token : '',
      uid: this.props.location.state ? this.props.location.state.uid : '',
      t_firstn:this.props.location.state.t_firstn,
      t_lastn:this.props.location.state.t_lastn,
      selectedTab: 0
    };

    this.logoutAction = this.logoutAction.bind(this);
    this.tabSelectionAction = this.tabSelectionAction.bind(this);
  }

  componentDidMount() {
    var that = this;

    var token = that.state.token;
    if (token) {
      window.onpopstate = function (event) {
        that.props.history.go(1);
      };
    }
    checkUserType('token ' + token).then(res => {
      if (res.status === "FAILED") that.props.history.push("/login");
    });
  }

  render() {
    var that = this;
    var state = this.state;
    return (
        <div className="fill-window">
          <div className='main-title-area' >
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" margin="10px" fill="currentColor" class="bi bi-person-badge" viewBox="0 0 16 16">
                <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"></path>
              </svg>
              &nbsp; Admin View</h3>
              <div style={{marginTop:'10px', width:'fit-content', display:'flex', flexDirection:'row', alignItems:'center', alignContent:'center', justifyContent:'center'}}>
                <h6> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"></path>
                  </svg>
                  &nbsp; <b>{this.state.t_firstn} {this.state.t_lastn}</b></h6>
               <button type="button" style={{margin:'0px 0 0 20px'}} className="btn" onClick={this.logoutAction}>Logout</button>
              </div>
          </div>
          <div className='tab-area'>
            <Tabs selectedIndex={state.selectedTab} onSelect={index => that.tabSelectionAction(index)}>
              <TabList>
                <Tab>User</Tab>
                <Tab>Class</Tab>
                <Tab>Subject</Tab>
                <Tab>Pupil</Tab>
              </TabList>
              <TabPanel>
                <UserTab token={state.token} uid={state.uid}/>
              </TabPanel>
              <TabPanel>
                <ClassTable token={state.token}/>
              </TabPanel>
              <TabPanel>
                <SubjectTab token={state.token}/>
              </TabPanel>
              <TabPanel>
                <PupilTab token={state.token}/>
              </TabPanel>
            </Tabs>
          </div>

        </div>
    )
  }

  logoutAction() {
    var that = this;
    that.setState({token: ''},
        () => {
          that.props.history.push({pathname:redirectpath});
        })
  }

  tabSelectionAction(idx){
    this.setState({selectedTab:idx})
  }
}
