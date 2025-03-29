// src/components/UserCard.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UserCard = ({ user, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${user.id}`, userData);
      setMessage('User updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating user.');
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setUserData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
    setIsEditing(false);
  };

  return (
    <div className="user-card">
      <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="user-avatar" />
      
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button onClick={handleUpdate} className="save-button">Save</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="user-info">
          <h3>{user.first_name} {user.last_name}</h3>
          <p>{user.email}</p>
          <div className="button-group">
            <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
            <button onClick={() => onDelete(user.id)} className="delete-button">Delete</button>
          </div>
        </div>
      )}
      
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default UserCard;
