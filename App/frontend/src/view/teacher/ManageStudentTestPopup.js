import React from "react";
import "../../App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default class ManageStudentTestPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      testList: this.props.testList,
      selectedTest: this.props.selectedTest,
      marks: this.props.studentData.marks,
      resid: this.props.studentData.resid,
      studentMarkData: this.props.studentMarkData,
    };

    this.onTestSelect = this.onTestSelect.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.oninputChange = this.oninputChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.close = this.close.bind(this);
    this.setID = this.setID.bind(this);

  }

  componentDidMount() {}

  render() {
    var that = this;
    return (
      <div className="popup">
        <div className="App popup_inner">
        <div className="custom_pop">
          <h2>{that.props.popupHeaderText}</h2>
          <br />
          <div style={{ alignItem: "left" }}>
            <Dropdown
              classname="style.dropDown"
              value={
                that.state.testList[
                  this.getIndex(this.state.testList, this.state.selectedTest)
                ]
              }
              options={that.state.testList}
              onChange={that.onTestSelect}
              placeholder="Select an option"
              placeholderClassName="myPlaceholderClassName"
            />
            <br/>
            <label> <b>Marks </b></label>
            <br />
            <input
              className="form-control"
              defaultValue={this.state.studentMarkData.marks}
              type="text"
              name="marks"
              onChange={that.oninputChange.bind(this, "marks")}
            />
            <br />
          </div>
          <div className="popup-button-area">
            <button className="btn btn-primary" id="addUpdate_btn" onClick={that.sendData}>Change</button>
            <button className="btn btn-danger" id="cancel_btn" onClick={this.close}>{"Cancel"}</button>
          </div>
          </div>
        </div>
      </div>
    );
  }

  close() {
    this.props.closePopup();
  }

  getIndex(arr, testVal) {
    return arr.findIndex((obj) => obj.value === testVal);
  }

  //******************* Changes On Select ********************/

  onTestSelect(e) {
    console.log(e.value);
    this.setState({ selectedTest: e.value }, () => {
      console.log(this.state.selectedTest);
    });
  }

  oninputChange(key, e) {
    switch (key) {
      case "marks":
        this.setState({
          studentMarkData: {
            aid: this.props.studentMarkData.aid,
            marks: e.target.value,
            name: this.props.studentMarkData.name,
            resid: this.props.studentMarkData.resid,
            uid: this.props.studentMarkData.uid,
            username: this.props.studentMarkData.username,
          },
        });
        break;
      default:
        break;
    }
  }

  //******************* Send Data to Subject Tab Component ********************/

  setID() {
    return "RES" + Date.now();
  }

  sendData() {
    var data = this.state.studentMarkData
    if(data.resid ===  null){
      data.resid = this.setID();
    }
    if (data.marks.length) this.props.updateInfo(data);
    else alert("Please provide all info");
  }
}
