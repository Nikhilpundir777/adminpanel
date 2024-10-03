import React, { useState } from 'react';
import './EmployeeManagement.css'; // Importing CSS for styling

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '' });
  const [filterKeyword, setFilterKeyword] = useState('');

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      setEmployees([...employees, { ...newEmployee, id: Date.now(), active: true }]);
      setNewEmployee({ name: '', email: '' });
      alert(`${newEmployee.name} has been added.`);
    } else {
      alert("Please provide both name and email.");
    }
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    alert("The employee has been removed.");
  };

  const toggleStatus = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    emp.email.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  return (
    <div className="employee-management">
      <h1>Employee Management</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Employee Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Employee Email"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
        />
        <button onClick={addEmployee}>Add Employee</button>
      </div>

      <input
        type="text"
        placeholder="Filter by name or email"
        value={filterKeyword}
        onChange={(e) => setFilterKeyword(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => toggleStatus(employee.id)}>
                  {employee.active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
