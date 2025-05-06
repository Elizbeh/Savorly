import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import api from '../services/api'; // Custom Axios instance

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/api/admin/users');
        console.log('Users fetched:', data); // Log to check the data
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users.');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch categories on initial load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
      } catch (err) {
        setCategoryError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  // Handle delete user
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      setError(`Failed to delete user: ${err.response?.data?.message || err.message}`);
    }
  };

  // Handle promote user to admin
  const handlePromote = async (userId) => {
    try {
      await api.put(`/api/admin/users/${userId}/promote`);
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: 'admin' } : user
      ));
    } catch (err) {
      console.error('Promote error:', err.response?.data || err.message);
      setError(`Failed to promote user: ${err.response?.data?.message || err.message}`);
    }
  };

  // Handle category name input change
  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  // Handle category creation
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      setCategoryError('Category name is required');
      return;
    }

    try {
      // Call API to create a new category
      const { data } = await api.post('/api/categories', { name: categoryName });
      setCategories([...categories, data]);
      setCategoryName('');
      setCategoryError(null); // Clear error if category creation is successful
    } catch (err) {
      setCategoryError('Failed to create category.');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1> 
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {categoryError && (
        <div className="error-message">
          <p>{categoryError}</p>
        </div>
      )}

      {/* Category Creation Form */}
      <div className="category-form">
        <h2>Create New Category</h2>
        <form onSubmit={handleCreateCategory}>
          <div>
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={handleCategoryNameChange}
              placeholder="Enter category name"
            />
          </div>
          <button type="submit">Create Category</button>
        </form>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <button onClick={() => handlePromote(user.id)}>
                        Promote to Admin
                      </button>
                    )}
                    <button onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display categories */}
      <div className="category-list">
        <h2>Existing Categories</h2>
        <ul>
          {categories.length === 0 ? (
            <li>No categories found.</li>
          ) : (
            categories.map(category => (
              <li key={category.id}>{category.name}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
