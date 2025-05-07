const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/employees';

const EmployeeService = {
    // ✅ Fetch Upcoming Birthdays
getUpcomingBirthdays: async () => {
    return await EmployeeService.apiRequest('get', '/upcoming-birthdays', null, 'Error fetching upcoming birthdays');
},

    
    // ✅ Fetch Employee Profile using token
    getProfile: async () => {
        const data = await EmployeeService.apiRequest('get', '/profile', null, 'Error fetching employee profile');

        // ✅ Save to localStorage
        if (typeof localStorage !== 'undefined' && data?.employee) {
            localStorage.setItem('employeeData', JSON.stringify(data.employee));
        }

        return data;
    },

    // ✅ Fetch All Employees
    getAllEmployees: async () => {
        return await EmployeeService.apiRequest('get', '/all', null, 'Error fetching employees');
    },

    // ✅ Add New Employee
    addEmployee: async (employeeData) => {
        return await EmployeeService.apiRequest('post', '/add', employeeData, 'Error adding employee');
    },

    // ✅ Shared API request handler
    apiRequest: async (method, endpoint, data, errorMessage) => {
        try {
            const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                console.warn('⚠️ No authentication token found.');
                throw new Error('Authentication required');
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios({
                method,
                url: `${API_BASE_URL}${endpoint}`,
                data,
                headers
            });

            if (!response || !response.data) {
                throw new Error('Empty response from server');
            }

            console.log(`✅ Success: ${endpoint}`, response.data);
            return response.data;

        } catch (error) {
            console.error(`❌ ${errorMessage}:`, error.response?.data || error.message);

            if (error.response?.status === 401 && typeof localStorage !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('employeeData');
                window.location.href = '/login';
            }

            throw new Error(error.response?.data?.message || 'Server error');
        }
    }
};

module.exports = EmployeeService;
