import React, { Component } from "react";
import { Button, Image} from "react-bootstrap";
import goBack from "../img/go-back-button.svg";
import styled from "styled-components/macro";
import alertIcon from "../img/alert-patient-page.png";
import axios from "axios";
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

const TableContainer = styled.div`
    margin: 24px;
    padding: 12px;
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    background-color: #5495c9;
  `;

const Table = styled.table`
    z-index: 9999;
    z-index: 1;
    width: 100%;
    font-size: 20px;
    color: #fff;
    background-color: #5495c9;
    th,
    td {
        text-align: left;
        padding: 8px;
    }
    td:last-child {
        text-align: center;
    }
    th {
        background-color: #e59c63;
    }
    tr:nth-child(odd) {
        background-color: #5495c9;
    }
    tr:nth-child(even) {
        background-color: #639ece;
    }
`;

const SubmitButton = styled.button`
  position: relative;
  width: 150px;
  height: 50px;
  margin: 0 auto;
  display: block;
  background: #e59c63;
  border-radius: 8px;
  font-weight: 800;
  font-family: Arial;
  font-size: 18px;
  color: #ffffff;
  border: 0px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    background: #ce8c59;
  }
`;





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
        inputBorderWidth: 5,
        inputFontWeight: "normal"
      }

      this.retireveAllRelatedForms = this.retireveAllRelatedForms.bind(this);
      this.renderAPage = this.renderAPage.bind(this);
      this.goBackToPreviousTable = this.goBackToPreviousTable.bind(this);
    }

    retrieveAllPatients = (event) => {
        console.log("hello" + this.state.patientName)
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
            cursor: 'pointer',
            top: '50%', 
            transform: 'translateY(-50%)',
            position:'absolute'
        }
        const alertStyling = {
            width: 30,
            height: 30,
            paddingLeft: 0,
            paddingRight: 0
        }

        const alertBoxStyling_1 = {
            width:40,
            display: this.state.showAlert_1 ? 'block':'none',
            position: 'absolute',
            transform: 'translateY(-50%)',
            top:'50%'
        }

        const alertBoxStyling_2 = {
            display : this.state.showAlert_2 ? 'block':'none',
            left:'50%',
            position: 'absolute',
            transform: 'translateX(-50%)',
        }

        const inputStyle = {
            width: 300,
            fontSize: '20px',
            fontFamily: 'Arial',
            caretColor: 'transparent',        
            color: '#e59c63',
            fontWeight: this.state.inputFontWeight,
            boxSizing: 'border-box',
            height:40,
            border:'none',
            textAlign:'center'
        }

        const borderStyle={
            borderWidth: this.state.inputBorderWidth,
            borderStyle: 'solid',
            borderColor: '#e59c63',
            borderRadius: 8,
            boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.2)",
            height: 40,
            boxSizing: 'content-box',
            transition: 'border-width 0.5s linear'
        }


        return (
            <div>
                <div className="App-header">
                    <div style={{top: '20%', position: 'absolute'}}> 
                        <div style={{float: 'left', paddingRight: 30}}>
                            <div style={borderStyle}>
                                <div style={{height: '100%', float: 'left', boxSizing:'border-box'}}>
                                    <input 
                                    type="text" 
                                    placeholder=" Patient Name " 
                                    value={this.state.patientName}
                                    onChange={this.enterPatientName}
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        this.setState({
                                            inputBorderWidth: 8,
                                            inputFontWeight: "bold"
                                        })}} 
                                    onBlur={(e) => {
                                        e.target.placeholder = "      Patient Name";
                                        this.setState({
                                            inputBorderWidth: 5,
                                            inputFontWeight: "normal"
                                        })
                                    }}
                                    style={inputStyle} />
                                </div>
                                <div style={{width:40, float:'left', height:'100%', boxSizing:'border-box', backgroundColor:'white', pisition: 'relative'}}>
                                    <div style={alertBoxStyling_1}>
                                        <Tippy content={<span style={{color: 'red'}}>We can't find such patient</span>}>
                                            <Image src={alertIcon} style={alertStyling}/>
                                        </Tippy>
                                    </div> 
                                </div>
                                
                            </div>
                            
                            

                           
                        </div>
                        
                        <div style={{float: 'left'}}>
                            <SubmitButton  onClick={this.retrieveAllPatients} style={{outline: 'none'}}>
                            Search
                            </SubmitButton>
                        </div>
                        
                        

                    </div>

                    <div style={{top: '30%', position: 'absolute', display:'flex'}}>

                        <div style={{width:50, position:'relative', float: 'left'}}>
                                <Image src={goBack} style={goBackStyling} onClick={this.goBackToPreviousTable}/>
                        </div>

                        <div style={{float: 'left', position:'relative'}}> 
                            <TableContainer style={{display : this.state.showTr_1 ? 'block':'none'}}>
                                <Table>
                                    <div>
                                    <thead >
                                        <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone #</th>
                                        <th></th>
                                       
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {this.state.allPatients.map(patient => (
                                            <tr>
                                            <td style={{minWidth: 100}}>{patient.name}</td>
                                            <td style={{minWidth: 100}}>{patient.email}</td>
                                            <td style={{minWidth: 100}}>{patient.phone}</td>
                                            <td style={{minWidth: 100}}>
                                                <Button style={{backgroundColor:'#e59c63', border: 'none'}} onClick={() => this.retireveAllRelatedForms(patient.patientID)}>Choose</Button>
                                            </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    </div>
                                </Table>
                            </TableContainer>

                            
                            <div style={alertBoxStyling_2}>
                                <Image src={alertIcon} style={{width: 30,
                                                               height: 30,
                                                               MarginRight: 5,
                                                               float:'left'}}/>
                                <p style={{float: 'left', marginLeft: 10}}>There is no such record</p>
                            </div>
                                            

                            <TableContainer style={{display : this.state.showTr_2 ? 'block':'none'}}>
                                <Table>
                                    <div>
                                    
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
                                                <Button style={{backgroundColor:'#e59c63', border: 'none'}}onClick={() => this.renderAPage(formObject.diagnosticID)}>Grab Form</Button>
                                            </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    </div>
                                </Table>
                            </TableContainer>                                
                        </div>
                    </div>
                            
                    

                    <div>

                        {/* <div style={alertBoxStyling_1}>
                            <Image src={alertIcon} style={alertStyling}/>
                            <p style={{fontSize: 18, fontFamily: 'Arial'}}> We can't find such patient </p>
                        </div> */}
                        
                        





                           

                        
                        {/* <div>
                            <div style={{ position:'relative', float: 'left'}}>
                                <div style={{top: '50%', position:'absolute'}}>
                                    <Image src={goBack} style={goBackStyling} onClick={this.goBackToPreviousTable}/>
                                </div>
                            </div>

                            <div style={{float: 'left'}}> 
                                <TableContainer style={{display : this.state.showTr_1 ? 'block':'none'}}>
                                <Table>
                                    <div>
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
                            </TableContainer>
                                
                            
                                <div style={alertBoxStyling_2}>
                                <Image src={alertIcon} style={alertStyling}/>
                                <p style={{fontSize: 18, fontFamily: 'Arial'}}> We can't find the record </p>
                                </div>
                            
                            <TableContainer style={{display : this.state.showTr_2 ? 'block':'none'}}>
                                <Table>
                                    <div>
                                    
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
                            </TableContainer>



                                
                            </div>



                        </div> */}
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

