// EmployeeManagement.jsx
import React, { useEffect, useState } from 'react';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        email: '',
        phone: '',
        gender: 'Male',
        imageUrl: '',
        status: 'active',
    });
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/employees', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setEmployees(data.data.employees);
        } else {
            setError('Failed to fetch employees');
            console.error('Failed to fetch employees:', response.statusText);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addOrUpdateEmployee = async () => {
        const token = localStorage.getItem('token');
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `http://localhost:8000/api/employees/${currentId}` : 'http://localhost:8000/api/employees';

        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setFormData({
                name: '',
                designation: '',
                email: '',
                phone: '',
                gender: 'Male',
                imageUrl: '',
                status: 'active',
            });
            setEditMode(false);
            setCurrentId(null);
            fetchEmployees();
        } else {
            setError('Failed to add or update employee');
            console.error('Failed to add or update employee:', response.statusText);
        }
    };

    const editEmployee = (employee) => {
        setFormData(employee);
        setEditMode(true);
        setCurrentId(employee._id);
    };

    const deleteEmployee = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            fetchEmployees();
        } else {
            setError('Failed to delete employee');
            console.error('Failed to delete employee:', response.statusText);
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(search.toLowerCase())
    );

    const sortedEmployees = filteredEmployees.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome Admin</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Employee"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <h3 className="text-xl font-semibold mb-4">{editMode ? 'Edit Employee' : 'Add New Employee'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2"
                />
                <input
                    type="text"
                    placeholder="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2"
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2"
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2"
                />
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2"
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input
                    type="text"
                    placeholder="Image URL"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2"
                />
            </div>
            <div className="flex justify-between mb-4">
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2 w-1/3"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button onClick={addOrUpdateEmployee} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    {editMode ? 'Update Employee' : 'Add Employee'}
                </button>
            </div>
            <label className="font-semibold mb-2">Sort By Name:</label>
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded-md p-2 mb-4"
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
            <ul className="divide-y divide-gray-300">
                {sortedEmployees.map(employee => (
                    <li key={employee._id} className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <img
                                src={employee.imageUrl}
                                alt={employee.name}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <h4 className="text-lg font-semibold">{employee.name}</h4>
                                <p>{employee.designation}</p>
                                <p>{employee.email}</p>
                                <p>{employee.phone}</p>
                                <p className="text-sm">Status: {employee.status ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => editEmployee(employee)} className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600">
                                Edit
                            </button>
                            <button onClick={() => deleteEmployee(employee._id)} className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 ml-2">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeManagement;
