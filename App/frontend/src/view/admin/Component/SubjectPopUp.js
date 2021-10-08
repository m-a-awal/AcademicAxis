import React from 'react';
import '../../../App.css';
import Dropdown from "react-dropdown";

import 'react-dropdown/style.css';

const StatusOptions = [
  { value: 'Archived', label: 'Archived' },
  { value: 'Not Archived', label: 'Not Archived' }
];

class SubjectPopUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classname: this.props.subjectInfo.classname,
      subjectname: this.props.subjectInfo.subjectname,
      tname: this.props.subjectInfo.tname,
      //Here uid is the teacher id
      uid: this.props.subjectInfo.uid,
      sid: this.props.subjectInfo.sid,
      selectedClass: this.props.selectedClass,
      allTeacher: this.props.allTeacher,
      selectedStatus: ''
    }
    this.oninputChange = this.oninputChange.bind(this);
    this.onTeacherSelect = this.onTeacherSelect.bind(this);
    this.onStatusSelect = this.onStatusSelect.bind(this);
    this.setSubjectID = this.setSubjectID.bind(this);
    this.sendData = this.sendData.bind(this);
    this.resetState = this.resetState.bind(this);
    this.close = this.close.bind(this);
  }

  render() {
    var that = this;
    return (
      <div className='popup'>
        <div className='App popup_inner'>
          <div className="custom_pop">
            <h2>{that.props.popupHeaderText + " " + (that.props.popupHeaderText !== "Update" ? 'Subject' : '')}</h2>
            <br />
            <div>
              {console.log(that.state.selectedClass)}
              <label> <b>Class name</b></label>
              <br />
              <input className="form-control" type="text" name="classname" defaultValue={that.state.classname} disabled />
              <br />

              <label><b> Subject Name</b></label>
              <input className="form-control" type="text" name="subjectname" defaultValue={that.props.popupHeaderText === "Update" ? that.state.subjectname : ""}
                onChange={that.oninputChange.bind(this, "subjectname")}
              />
              <br />

              <label><b> Teacher </b></label>
              <br />
              <Dropdown classname='style.dropDown'
                options={this.state.allTeacher}
                value={this.state.uid}
                onChange={this.onTeacherSelect}
                placeholder="Choose a Teacher"
                placeholderClassName='myPlaceholderClassName' />
              <br />

              {that.props.popupHeaderText === "Update" ?
                <div>
                  <label><b> Status </b></label>
                  <Dropdown classname='style.dropDown'
                    options={StatusOptions}
                    value={"Not Archived"}
                    onChange={this.onStatusSelect}
                    placeholder="Set a status"
                    placeholderClassName='myPlaceholderClassName' />
                  <br />
                </div> : null}
            </div>
            <div className="popup-button-area">
              <button className='btn btn-primary' id="addUpdate_btn" onClick={that.sendData}>{this.props.popupBtnText}</button>
              <button className='btn btn-danger' id="cancel_btn" onClick={this.close}>{"Close"}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }


  //******************* Changes On Select/Input ********************/

  oninputChange(key, e) {
    switch (key) {
      case "subjectname":
        this.setState({ subjectname: e.target.value });
        break;
      default:
        break;
    }
  }

  onTeacherSelect(e) {
    this.setState({ uid: e.value })
  }

  onStatusSelect(e) {
    this.setState({ selectedStatus: e.value })
  }


  //******************* Send Data to Subject Tab Component ********************/

  setSubjectID() {
    return "SUB" + Date.now()
  }

  sendData() {
    var tempStatus = this.state.selectedStatus;
    if (this.state.selectedStatus === "")
      tempStatus = "Not Archived"

    var data = this.props.popupBtnText === "Add" ? {
      "classname": this.state.classname,
      "subjectname": this.state.subjectname,
      "uid": this.state.uid,
      "cid": this.state.selectedClass,
      "status": "Not Archived",
      "sid": this.setSubjectID()

    } : {
      "classname": this.state.classname,
      "subjectname": this.state.subjectname,
      "uid": this.state.uid,
      "cid": this.state.selectedClass,
      "status": tempStatus,
      "sid": this.state.sid
    }

    //this.resetState();

    if (this.props.popupBtnText === "Add") {
      if (data.subjectname.length && data.uid.length)
        this.props.addSubject(data)

      else alert("Subject and Teacher name cannot be empty");
    } else {
      if (data.subjectname.length && data.uid.length && data.status.length)
        this.props.updateInfo(data);
      else alert("Please provide all info")
    }
  }


  //******************* Close PopUp & Reset State ********************/

  close() {
    this.props.closePopup();
  }

  resetState() {
    this.setState({
      classname: '',
      subjectname: '',
      tname: '',
      //Here uid is the teacher id
      uid: '',
      sid: '',
      selectedClass: '',
      allTeacher: '',
      selectedStatus: ''
    })
  }

}

export default SubjectPopUp;
