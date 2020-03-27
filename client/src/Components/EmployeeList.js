import React from 'react';
import { Table } from 'reactstrap';

const EmployeeList = (props) => {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
          {props.tbData && props.tbData.length > 0 ? props.tbData.map((emp, index) => {
              return <tr key={index}>
                <th scope="row">{index+1}</th>
                <td>{emp.firstName}</td>
                <td>{emp.lastName}</td>
                <td>{emp.role}</td>
                <td>
                    <div onClick={()=> {
                        props.onUpdate(props.tbData && props.tbData.length > 0 && props.tbData[index])
                    }}>Update</div>
                    <div onClick={()=> {
                        props.onDelete(props.tbData && props.tbData.length > 0 && props.tbData[index])
                    }}>Delete</div>
                </td>
                </tr> }) :
            <tr>No Records Found</tr>
            }
      </tbody>
    </Table>
  );
}

export default EmployeeList;