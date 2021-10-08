import React from 'react';
import Dropdown from "react-dropdown";
import { getAllClass, searchPupil, getPupilByClass, updateAssignedPupil, assignPupil } from "../../../api/AdminAPI";
import SearchField from 'react-search-field';
import './UserTab.css'

class PupilTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classByList: false,
      selectedClass: '',
      classList: [],
      pupilList: [],
      selectedPupilList: [],
      token: "token " + this.props.token,
      checkedPupil: [],
      isPupilExists: true,
      searchBy: ''
    }
    this.oninputChange = this.oninputChange.bind(this);
    this.loadAllClass = this.loadAllClass.bind(this);
    this.assignStudent = this.assignStudent.bind(this);
    this.loadFillData = this.loadFillData.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.goClassTab = this.goClassTab.bind(this);
    this.viewStudentList = this.viewStudentList.bind(this);
    this.onClassSelect = this.onClassSelect.bind(this);
    this.setID = this.setID.bind(this);

  }

  componentDidMount() {
    this.loadAllClass();
  }

  render() {
    var that = this;
    return (
      <div>
        <h5 style={{ color: '#8c8c8c', textAlign: 'left', margin: '10px 0 10px 9.9%' }}>Pupil Management</h5>
        <div className="box-container">
          <div className="selection-area">
            <div className="dropDownItem card row justify-content-center align-items-center">
              <p><b>Search Pupil</b></p>
              <SearchField placeholder='Search Pupil' onSearchClick={that.oninputChange} />
            </div>
            <div className="SecondItem card row justify-content-center align-items-center">
              <p><b>Select a class</b></p>
              <Dropdown classname='style.dropDown'
                options={this.state.classList}
                onChange={this.onClassSelect}
                placeholder="Choose a class"
                placeholderClassName='myPlaceholderClassName' />
            </div>
            <div className="SecondItem card row justify-content-center align-items-center">
              <p><b>Assign/DeAssign Pupil</b></p>
              <button style={{ }} className="btn btn-success " onClick={that.assignStudent}>Assign</button>
              <button style={{ marginTop: '20px', backgroundColor:'#a291f2',borderColor:'#a291f2' }} className="btn btn-success " onClick={that.viewStudentList}>View List</button>
            </div>
          </div>
          <div className="table-box">
            {that.state.pupilList.length ?
              <div className="ag-theme-alpine data-table">
                <div className="table-scroll">
                  <table className="table table-hover">
                    <thead className="thead-light">
                      <tr key={"user_key1"}>
                        {that.state.classByList ? null : <th scope="col"></th>}
                        <th scope="col">Username</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        {that.state.classByList ? null : <th scope="col">Assigned In</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {this.loadFillData()}
                    </tbody>
                  </table>
                </div>
              </div> : null}        
          {that.state.isPupilExists ? null : <div><label>There is no pupil information for this class</label></div>}
          </div>
        </div>
      </div>
    )
  }

  goClassTab() {
    this.props.tabSelection(1);
  }

  onClassSelect(e) {
    this.setState({
      selectedClass: e.value,
      // pupilList:[],
      // isPupilExists:true
    })
  }

  viewStudentList() {
    var that = this;
    if (that.state.selectedClass) {
      getPupilByClass(that.state.selectedClass, that.state.token).then(response => {
        that.setState({
          pupilList: response.data,
          classByList: true,
          isPupilExists: response.data.length ? true : false
        });
      })
    } else {
      alert("Please select a class first")
    }
  }

  oninputChange(e) {
    var that = this;
    if (e.length)
      searchPupil(e, that.state.token).then((response) => {
        that.setState({
          pupilList: response.data,
          classByList: false,
          isPupilExists: response.data.length ? true : false,
          searchBy: e
        }, () => {
          that.loadFillData();
        })
      })
    else { alert("Please provide something to search") }
  }

  loadAllClass() {
    var tempList = [];
    var that = this;
    getAllClass(that.state.token).then((data) => {
      data.data.forEach((info) => {
        var obj = { value: info.cid, label: info.classname };
        tempList.push(obj);
      });
      this.setState({ classList: tempList }, () => {
        // console.log(that.state.classList)
      });
    });
  }

  assignStudent() {
    var that = this;
    if (that.state.selectedClass && that.state.selectedPupilList.length) {
      that.state.selectedPupilList.forEach(pupil => {
        if (that.state.selectedPupilList.length === 1 && pupil.cid === that.state.selectedClass) {
          alert('This student is already in the selected class');
          return;
        }
        var dataObj = {
          csid: that.setID(),
          uid: pupil.uid,
          cid: that.state.selectedClass
        }
        assignPupil(dataObj, that.state.token).then(response => {

        })
      })

      getPupilByClass(that.state.selectedClass, that.state.token).then(response => {
        that.setState({
          pupilList: response.data,
          classByList: true,
          isPupilExists: response.data.length ? true : false,
          checkedPupil: [],
          selectedPupilList: []
        });
      })

    } else {
      alert("Please select Class and one or more pupil to assign them");
    }
  }

  setID() {
    return "ASGN" + Date.now()
  }

  loadFillData() {
    var that = this;
    if (this.state.pupilList.length) {
      return this.state.pupilList.map(data => {
        if (data.isAssigned === 'Y' || data.isAssigned === null)
          return (
            <tr key={data.uid}>
              {that.state.classByList ? null :
                <td>{<input id={data.uid} name={data.uid} type="checkbox"
                  onChange={(e) => this.handleCheckBox(e, data)} />}</td>}
              <td>{data.username}</td>
              <td>{data.firstname}</td>
              <td>{data.lastname}</td>
              {that.state.classByList ? null : <th>{data.classname}</th>}
            </tr>
          )
      })
    }
  }

  handleCheckBox(e, data) {
    var that = this;

    let resultArray = []
    let tempSelectedList = []

    if (e.target.checked) {
      resultArray = that.state.checkedPupil.filter(checkedID => checkedID !== e.target.id)
      tempSelectedList = that.state.selectedPupilList.filter(obj => obj.uid !== e.target.id)
      resultArray.push(e.target.id)
      tempSelectedList.push(data)
    } else {
      resultArray = that.state.checkedPupil.filter(checkedID => checkedID !== e.target.id)
      tempSelectedList = that.state.selectedPupilList.filter(obj => obj.uid !== e.target.id)
    }
    that.setState({
      checkedPupil: resultArray,
      selectedPupilList: tempSelectedList
    })
  }
}


export default PupilTab;
