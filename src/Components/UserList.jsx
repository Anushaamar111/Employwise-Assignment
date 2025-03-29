import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch users whenever the page changes or after updates
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      // Update the local state to reflect the deletion
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-list-container">
      <div className="header">
        <h2>User List</h2>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="user-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
              <h3>{user.first_name} {user.last_name}</h3>
              <p>{user.email}</p>
              <div className="button-group">
                <button onClick={() => handleEdit(user.id)} className="btn-primary">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
