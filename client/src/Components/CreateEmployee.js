import React from 'react';
import axios from 'axios';
import { Button, Form, Alert, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import EmployeeList from './EmployeeList';

class CreateEmployee extends React.Component {
	constructor() {
		super();
		this.state = {
			id: null,
			res: [],
			firstName: "",
			lastName: "",
			hireDate: "",
			role: "CEO",
			favJoke: "",
			showError: false,
			errMsg: ""
		};
	}
	getEmpList = () => {
		axios.get('http://localhost:3001/api/employees')
			.then(response => {
				// handle success
				this.setState({empList: response.data.data});
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
	}
	componentDidMount() {
		axios.get('https://quotes.rest/qod')
			.then(response => {
				// handle success
				this.setState({res: response});
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
			this.getEmpList();
	}
	onChange = (e) => {
		this.setState({[e.target.name]: e.target.value});
	}
	empSubmit = (e) => {
		e.preventDefault();
		console.log("ON SUBMIT", this.state)
		let stateObj = this.state;
		if(this.state.id) {
			axios.put(`http://localhost:3001/api/employees/${stateObj.id}`, 
			{
				firstName: stateObj.firstName,
				lastName: stateObj.lastName,
				hireDate: stateObj.hireDate,
				role: stateObj.role,
				favJoke: stateObj.res.data &&
									stateObj.res.data.contents &&
									stateObj.res.data.contents.quotes &&
									stateObj.res.data.contents.quotes.length > 0 &&
									stateObj.res.data.contents.quotes[0].quote
			}).then((response) => {
					this.getEmpList();
					this.setState({
						res: [],
						firstName: "",
						lastName: "",
						hireDate: "",
						role: "CEO",
						favJoke: "",
						showError: false,
						errMsg: ""
					})
				}).catch( (error) => {
					this.setState({showError: true, errMsg: error.response.data.message})
				});
		} else {
			axios.post('http://localhost:3001/api/employees', 
			{
				firstName: stateObj.firstName,
				lastName: stateObj.lastName,
				hireDate: stateObj.hireDate,
				role: stateObj.role,
				favJoke: stateObj.res.data &&
									stateObj.res.data.contents &&
									stateObj.res.data.contents.quotes &&
									stateObj.res.data.contents.quotes.length > 0 &&
									stateObj.res.data.contents.quotes[0].quote
			}).then((response) => {
					this.getEmpList();
					this.setState({
						res: [],
						firstName: "",
						lastName: "",
						hireDate: "",
						role: "CEO",
						favJoke: "",
						showError: false,
						errMsg: ""
					})
				}).catch( (error) => {
					this.setState({showError: true, errMsg: error.response.data.message})
				});
		}
	}
	onDelete = (rowData) => {
		axios.delete(`http://localhost:3001/api/employees/${rowData.id}`)
			.then(response => {
				// handle success
				this.getEmpList();
				
				// this.test = response;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
	}
	onUpdate = (rowData) => {
		axios.get(`http://localhost:3001/api/employees/${rowData.id}`)
			.then(response => {
				console.log("RESOPNSE ::", response.data.data)
				// handle success
				let resVal = response.data.data;
				this.setState({
					id: resVal.id,
					firstName: resVal.firstName,
					lastName: resVal.lastName,
					hireDate: resVal.hireDate,
					role: resVal.role,
					favJoke: resVal.favJoke
				})
				
				// this.test = response;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
	}
	onDismiss = () => {
		this.setState({showError: false})
	}
	render() {
		return (
			<Container>
				<Alert color="danger" isOpen={this.state.showError} toggle={this.onDismiss}>
					{this.state.errMsg}
				</Alert>
				<Row>
					<Col className="form-container" xs="6">
						<h2>Create Employee</h2>
						<Form onSubmit={this.empSubmit} method="POST">
							<FormGroup>
								<Label for="firstName">First Name</Label>
								<Input type="text"
									onChange={this.onChange}
									name="firstName"
									id="firstName"
									value={this.state.firstName && this.state.firstName}
									placeholder="First Name" />
							</FormGroup>
							<FormGroup>
								<Label for="lastName">Last Name</Label>
								<Input
									type="text"
									onChange={this.onChange}
									name="lastName"
									id="lastName"
									value={this.state.lastName && this.state.lastName}
									placeholder="Last Name" />
							</FormGroup>
							<FormGroup>
								<Label for="roleSelect">Role</Label>
								<Input
									type="select"
									onChange={this.onChange}
									name="role"
									value={this.state.role && this.state.role}
									id="roleSelect"
								>
									<option>CEO</option>
									<option>VP</option>
									<option>MANAGER</option>
									<option>LACKEY</option>
								</Input>
							</FormGroup>
							<FormGroup>
								<Label for="exampleDate">Date</Label>
								<Input
									type="date"
									onChange={this.onChange}
									name="hireDate"
									value={this.state.hireDate && this.state.hireDate}
									id="hireDate"
									placeholder="Hire Date"
								/>
							</FormGroup>
							<FormGroup>
								<Label for="quotesText">Quotes</Label>
								<Input type="textarea" disabled={true} value={this.state.res.data &&
									this.state.res.data.contents &&
									this.state.res.data.contents.quotes &&
									this.state.res.data.contents.quotes.length > 0 &&
									this.state.res.data.contents.quotes[0].quote} name="quotes" id="quotesText" />
							</FormGroup>
							<Button type="submit">Submit</Button>
						</Form>
					</Col>
				</Row>
				<Row>
					<EmployeeList
						tbData={this.state.empList}
						onDelete={this.onDelete}
						onUpdate={this.onUpdate}
					/>
				</Row>
			</Container>
		);
	}
}

export default CreateEmployee;