// src/hooks/useEmployees.js
import { useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import axios from 'axios';

export const useEmployees = () => {
  const { employees, setEmployees } = useContext(EmployeeContext);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  const addEmployee = async (employeeData) => {
    try {
      const response = await axios.post('/api/employees', employeeData);
      setEmployees([...employees, response.data.data.employee]);
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  const updateEmployee = async (id, updatedData) => {
    try {
      const response = await axios.patch(`/api/employees/${id}`, updatedData);
      const updatedEmployee = response.data.data.employee;
      setEmployees(
        employees.map((employee) => (employee._id === id ? updatedEmployee : employee))
      );
    } catch (error) {
      console.error('Error updating employee:', error.message);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error.message);
    }
  };

  return { employees, fetchEmployees, addEmployee, updateEmployee, deleteEmployee };
};
