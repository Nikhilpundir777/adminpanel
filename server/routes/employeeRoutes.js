const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authController = require('../controllers/authController');

// Protect all routes below (only accessible to logged-in admins)
router.use(authController.protect);

// Route to get all employees with filtering, sorting, and pagination
router.get('/', employeeController.getAllEmployees);

// Route to create a new employee
router.post('/', employeeController.createEmployee);

// Route to update an existing employee by ID
router.patch('/:id', employeeController.updateEmployee);

// Route to delete an employee by ID
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
