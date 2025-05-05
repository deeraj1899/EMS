import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API_ENDPOINT } from '../../utils/constant'; 

const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try 
        {  
            const url = `${ADMIN_API_ENDPOINT}/SuperAdminLogin`;
            // console.log("Making request to URL:", url);  
            // console.log({email,password});
            const response = await axios.post(url, { superadminmail: email, superadminpassword: password });

            if (response.status === 200) {
               
                navigate('/SuperAdmin/dashboard', { state: { superAdminId: response.data.superAdminId } });
            }
        } catch (err) {
            
            setError(err.response?.data?.message || 'Something went wrong!');
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">SuperAdmin Login</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default SuperAdminLogin;