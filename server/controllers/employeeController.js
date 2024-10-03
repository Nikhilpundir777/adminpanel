const { employeemodel } = require('../models/employeeModel');
const { z } = require('zod');

// Zod schema for employee validation
const employeeSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    mobile: z.string().regex(/^\d+$/),
    designation: z.enum(['HR', 'Manager', 'Sales']),
    gender: z.enum(['M', 'F']),
    course: z.array(z.string()),
    imageUrl: z.string().regex(/\.(jpg|jpeg|png)$/i),
    status: z.boolean().optional(),
});

// Get all employees with filtering, sorting, and pagination
exports.getAllEmployees = async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludedFields = ['sort', 'page', 'limit'];
        excludedFields.forEach((el) => delete queryObj[el]);

        let query = employeemodel.find(queryObj);

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }

        // Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        const employees = await query;
        res.status(200).json({
            status: 'success',
            results: employees.length,
            data: { employees },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
    try {
        const validData = employeeSchema.parse(req.body);
        
        // Create a new employee using the validated data
        const employee = await employeemodel.create(validData);

        res.status(201).json({
            status: 'success',
            data: { employee },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.errors ? err.errors : err.message,
        });
    }
};

// Update employee details
exports.updateEmployee = async (req, res) => {
    try {
        const validData = employeeSchema.partial().parse(req.body);
        
        const employee = await employeemodel.findByIdAndUpdate(req.params.id, validData, {
            new: true,
            runValidators: true,
        });

        if (!employee) {
            return res.status(404).json({ status: 'fail', message: 'No employee found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { employee },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.errors ? err.errors : err.message,
        });
    }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await employeemodel.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ status: 'fail', message: 'No employee found with that ID' });
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};
