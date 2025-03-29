import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditUser = () => {
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users/${id}`);
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setMessage('Error loading user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send update request to API
      await axios.put(`https://reqres.in/api/users/${id}`, user);
      
      // Show success message
      setMessage('User updated successfully!');
      
      // Navigate back to user list after a short delay
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error updating user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (isLoading) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      {message && <div className={message.includes('Error') ? 'error-message' : 'message'}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={user.first_name || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={user.last_name || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="button-group">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update User'}
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
