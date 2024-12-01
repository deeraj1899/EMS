import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ADMIN_API_ENDPOINT } from '../utils/constant';

const UseGetAllSubmittedWorks = () => {
    const adminId = useSelector(store => store.employee.employeeId);
    const [submittedWork, setSubmittedWork] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAllSubmittedWorks = async () => {
            try {
                setLoading(true); 
                const response = await axios.get(`${ADMIN_API_ENDPOINT}/getallsubmittedworks/${adminId}`);
                if (response.data.success) {
                    console.log(response.data.works); 
                    setSubmittedWork(response.data.works); 
                } else {
                    setError(response.data.message); 
                }
            } catch (err) {
                setError('Error fetching submitted works'); 
            } finally {
                setLoading(false); 
            }
        };

        if (adminId) {
            getAllSubmittedWorks();
        }
    }, [adminId]); 

    return { submittedWork, loading, error }; 
};

export default UseGetAllSubmittedWorks;
