import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import UseGetAllOrganizations from '../../hooks/UseGetAllOrganizations';
  import toast from 'react-hot-toast';
  import { ADMIN_API_ENDPOINT } from '../../utils/constant';

  const SuperAdmin = () => {
      const { organizationData, loading, error, refetch } = UseGetAllOrganizations();
      console.log(organizationData);

      const navigate = useNavigate();

      const handleRevenueClick = () => {
          navigate(`/superadmin/dashboard/revenue`);
      };

      const handleDelete = async (organizationId) => {
          if (!window.confirm('Are you sure you want to delete this organization and all related data?')) {
              return;
          }

          try {
              const token = localStorage.getItem('token'); // Get the JWT token from localStorage
              if (!token) {
                  toast.error('Please log in to perform this action');
                  navigate('/superadmin/login');
                  return;
              }

              const response = await fetch(`${ADMIN_API_ENDPOINT}/superadmin/organization/${organizationId}`, {
                  method: 'DELETE',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
              });

              // Check if the response is OK before parsing as JSON
              if (!response.ok) {
                  const errorText = await response.text(); // Try to get the error message as text
                  console.error('Delete response error:', errorText);
                  throw new Error(errorText || `Failed to delete organization (Status: ${response.status})`);
              }

              const data = await response.json();

              toast.success(data.message);
              setTimeout(() => navigate("/SuperAdmin/dashboard"), 3000);
          } catch (error) {
              console.error('Error deleting organization:', error);
              toast.error(error.message || 'Error deleting organization');
          }
      };

      return (
          <div className="container mx-auto p-6">
              <h2 className="text-2xl font-bold mb-4">Organization Overview</h2>
              <div className="flex space-x-4 mb-6">
                  <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                      onClick={handleRevenueClick}
                  >
                      Show Revenue Status
                  </button>
                  <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={() => navigate('/')}
                  >
                      Home
                  </button>
              </div>
              {loading && <p className="text-gray-600">Loading data...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && organizationData.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {organizationData.map((org, index) => (
                          <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                              <div className="mb-4">
                                  {org.Organization_Logo ? (
                                      <img
                                          src={org.Organization_Logo}
                                          alt={`${org.organization_name || 'Organization'} Logo`}
                                          className="w-24 h-24 object-contain rounded"
                                      />
                                  ) : (
                                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm">
                                          No Logo Available
                                      </div>
                                  )}
                              </div>
                              <div className="text-center">
                                  <h3 className="text-lg font-semibold mb-2">{org.organization_name || 'No Name Available'}</h3>
                                  <p className="text-gray-600"><strong>Admin Name:</strong> {org.adminname || 'N/A'}</p>
                                  <p className="text-gray-600"><strong>Email:</strong> {org.mail || 'N/A'}</p>
                                  <p className="text-gray-600"><strong>Employees:</strong> {org.employees ? org.employees.length : 0}</p>
                                  <p className="text-gray-600"><strong>Plan Price:</strong> ₹{(org.price / 100).toLocaleString('en-IN') || 0}</p>
                                  <p className="text-gray-600"><strong>Plan Duration:</strong> {org.duration || 0} months</p>
                                  <button
                                      onClick={() => handleDelete(org._id)}
                                      className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                  >
                                      Delete
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  !loading && <p className="text-gray-600">No organizations found.</p>
              )}
          </div>
      );
  };

  export default SuperAdmin;