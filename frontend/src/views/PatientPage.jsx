import React, { Component } from "react";
import { Form, Button, Col, Table, Image} from "react-bootstrap";
import goBack from "../img/go-back-button.png";
import alertIcon from "../img/alert-patient-page.png";
import axios from "axios";


export default class PatientPage extends Component {
  constructor(props) {
    super(props);

      this.state = {
        patientName: '',
        allPatients: [],
        relatedForms: [],
        showTr_1: false,
        showTr_2: false, 
        showAlert_1: false,
        showAlert_2: false,
      }

      this.retireveAllRelatedForms = this.retireveAllRelatedForms.bind(this);
      this.renderAPage = this.renderAPage.bind(this);
      this.goBackToPreviousTable = this.goBackToPreviousTable.bind(this);
    }

    retrieveAllPatients = (event) => {
        event.preventDefault();
        this.setState({
            showTr_1: false,
            showTr_2: false,
            showAlert_1: false,
            showAlert_2: false
        })
        axios.get(`http://localhost:3001/api/v1/patient/search/${this.state.patientName}`).then(res => {
            const patientsData = res.data
            if(patientsData.length !== 0){
                this.setState({
                    allPatients: patientsData,
                    showTr_1: true
                })
            }else{
                this.setState({
                    showAlert_1: true
                })   
            }  
        })
    }

    retireveAllRelatedForms = (pID) => {
        let lengthOfPatients = this.state.allPatients.length
        let flag = true
        for(let i = 0; i< lengthOfPatients; i++){
            if (this.state.allPatients[i].patientID === pID){
                if(this.state.allPatients[i].relatedForms.length !== 0){
                    this.setState({
                        relatedForms: this.state.allPatients[i].relatedForms,
                        showTr_2: true,
                        showTr_1: false
                    })
                    flag = false
                }
                break  
            }
        }
        if (flag){
            this.setState({
                showAlert_2: true
            })
        }
        
    }

    enterPatientName = (event) => {
        this.setState({
            patientName: event.target.value
          });
     }
    

    goBackToPreviousTable = () => {
        this.setState({
            showTr_1: true,
            showTr_2: false
        })
    }

    renderAPage = (dID) =>{
        window.open(`/draft/${dID}`);
    }

    render() {
        const goBackStyling = {
            width: 50,
            height: 50,
            marginRight: 0,
            display : this.state.showTr_2 ? 'block':'none',
            cursor: 'pointer'
        }
        const alertStyling = {
            width: 30,
            height: 30,
            float: 'left',
            marginRight:5
        }

        const alertBoxStyling_1 = {
            marginLeft:27,
            width:400,
            display : this.state.showAlert_1 ? 'block':'none',
        }

        const alertBoxStyling_2 = {
            marginLeft:27,
            width:400,
            display : this.state.showAlert_2 ? 'block':'none',
        }

        return (
            <div>
                <div className="App-header">


                    <div>
                    <h1>Enter Patient Name:</h1>
                    <Form onSubmit={this.retrieveAllPatients} >
                        <Form.Row>
                            <Col>
                            <Form.Group>
                            <Form.Label>Patient Name:</Form.Label>
                            <Form.Control
                            value={this.state.name}
                            onChange={this.enterPatientName}
                            />
                            </Form.Group>
                            </Col>
                            <Col>
                            <Button
                            variant="primary"
                            type="submit"
                            style={{ marginTop: "32px", marginLeft: "6px", float: 'left', backgroundColor:'#e59c63'}}
                            >
                            Submit
                            </Button>
                            
                            </Col>
                        </Form.Row>     
                    </Form>
                    </div>

                    <div>
                        <div style={{float: 'left', height:70, width:70}}>
                            <div style={{position:'absolute', left:450}}><Image src={goBack} style={goBackStyling} onClick={this.goBackToPreviousTable}/></div>
                        </div>

                        
                        <div style={{float: 'left'}}>

                            <div style={alertBoxStyling_1}>
                            <Image src={alertIcon} style={alertStyling}/>
                            <p style={{fontSize: 18, fontFamily: 'Arial'}}> We can't find such patient </p>
                            </div>

                            <div> 
                                <Table
                                
                                hover
                                style={{ maxWidth: "max-content", backgroundColor: 'white', borderRadius: 7}}>
                                    <div style={{display : this.state.showTr_1 ? 'block':'none'}}>
                                    <thead >
                                        <tr>
                                        <th >Name</th>
                                        <th >Email</th>
                                        <th >Phone #</th>
                                        <th >Choose</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {this.state.allPatients.map(patient => (
                                            <tr>
                                            <td style={{minWidth: 100}}>{patient.name}</td>
                                            <td style={{minWidth: 100}}>{patient.email}</td>
                                            <td style={{minWidth: 100}}>{patient.phone}</td>
                                            <td style={{minWidth: 100}}>
                                                <Button style={{backgroundColor:'#e59c63'}} onClick={() => this.retireveAllRelatedForms(patient.patientID)}>Choose</Button>
                                            </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    </div>
                                </Table>

                                <div style={alertBoxStyling_2}>
                                <Image src={alertIcon} style={alertStyling}/>
                                <p style={{fontSize: 18, fontFamily: 'Arial'}}> We can't find the record </p>
                                </div>

                                <Table
                                
                                hover
                                style={{ maxWidth: "max-content", backgroundColor: 'white', borderRadius: 7, position: 'absolute', left: 530}}>
                                    <div style={{display : this.state.showTr_2 ? 'block':'none'}}>
                                    
                                    <thead >
                                        <tr>
                                        <th >Filler</th>
                                        <th >Form</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.relatedForms.map(formObject => (
                                            <tr>
                                            <td style={{minWidth: 100}}>{formObject.filler}</td>
                                            <td style={{minWidth: 100}}>
                                                <Button style={{backgroundColor:'#e59c63'}}onClick={() => this.renderAPage(formObject.diagnosticID)}>Grab Form</Button>
                                            </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    </div>
                                </Table>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                    
                        

                        
                    </div>
                </div>                     
            </div>
        );
    }
}

//TODO: last version of homepage
// import React, { Component } from "react";
// import { Table, Form, Col, Button } from "react-bootstrap";
// import axios from "axios";

// export default class HomePage extends Component {
//   constructor(props) {
//     super(props);

//     this.onChangeName = this.onChangeName.bind(this);
//     this.onChangeEmail = this.onChangeEmail.bind(this);
//     this.onChangePhone = this.onChangePhone.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);

//     this.state = {
//       name: "",
//       email: "",
//       phone: "",
//       patients: [],
//     };
//   }

//   componentDidMount() {
//     this.getPatients();
//   }

//   onChangeName(e) {
//     this.setState({
//       name: e.target.value,
//     });
//   }

//   onChangeEmail(e) {
//     this.setState({
//       email: e.target.value,
//     });
//   }

//   onChangePhone(e) {
//     this.setState({
//       phone: e.target.value,
//     });
//   }

//   getPatients() {
//     axios.get("http://localhost:3001/api/v1/patient/").then((response) => {
//       if (response.data.length > 0) {
//         console.log(response.data);

//         this.setState({
//           patients: response.data,
//         });
//       }
//       console.log(this.state.patients);
//     });
//   }

//   onSubmit(e) {
//     e.preventDefault();

//     const patient = {
//       //TODO: this needs to be a util
//       patientID: require("crypto")
//         .createHash("SHA256")
//         .update(this.state.name.concat(this.state.email, this.state.phone))
//         .digest("hex")
//         .slice(0, 15),
//       //TODO: put slice number as env variable
//       name: this.state.name,
//       email: this.state.email,
//       phone: this.state.phone,
//     };

//     console.log(patient);
//     axios
//       .post("http://localhost:3001/api/v1/patient/add", patient)
//       .then((res) => {
//         console.log(res.data);
//         this.getPatients();
//       });

//     this.setState({
//       name: "",
//       email: "",
//       phone: "",
//     });
//   }

//   render() {
//     return (
//       <div>
//         <div className="App-header">
//           <h1>Add a New Patient:</h1>
//           <Form onSubmit={this.onSubmit}>
//             <Form.Row>
//               <Form.Group as={Col}>
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   value={this.state.name}
//                   onChange={this.onChangeName}
//                 />
//               </Form.Group>

//               <Form.Group as={Col}>
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   value={this.state.email}
//                   onChange={this.onChangeEmail}
//                 />
//               </Form.Group>

//               <Form.Group as={Col}>
//                 <Form.Label>Phone</Form.Label>
//                 <Form.Control
//                   value={this.state.phone}
//                   onChange={this.onChangePhone}
//                 />
//               </Form.Group>
//               <Form.Group>
//                 <Button
//                   variant="primary"
//                   type="submit"
//                   style={{ marginTop: "32px", marginLeft: "6px" }}
//                 >
//                   Submit
//                 </Button>
//               </Form.Group>
//             </Form.Row>
//           </Form>
//           <br />
//           <br />
//           <h1>Current patients in a database:</h1>
//           <Table
//             striped
//             bordered
//             hover
//             variant="dark"
//             style={{ maxWidth: "700px" }}
//           >
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//               </tr>
//             </thead>
//             <tbody>
//               {this.state.patients.map((p) => (
//                 <tr key={p.patientID}>
//                   <td>{p.patientID}</td>
//                   <td>{p.name}</td>
//                   <td>{p.email}</td>
//                   <td>{p.phone}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </div>
//     );
//   }
// }

