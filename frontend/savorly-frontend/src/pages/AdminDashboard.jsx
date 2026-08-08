import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import api from '../services/api';

const AdminDashboard = () => {
  // State Management
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // users, categories
  
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/admin/users');
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoryError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  // Auto-dismiss messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle user deletion
  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${userName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      setSuccessMessage(`User "${userName}" deleted successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Handle user promotion
  const handlePromote = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to promote "${userName}" to Admin?`
    );
    if (!confirmed) return;

    try {
      await api.put(`/api/admin/users/${userId}/promote`);
      setUsers(
        users.map(user =>
          user.id === userId ? { ...user, role: 'admin' } : user
        )
      );
      setSuccessMessage(`User "${userName}" promoted to Admin.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to promote user.');
    }
  };

  // Handle category creation
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setCategoryError('Category name is required');
      return;
    }
    if (trimmedName.length < 2) {
      setCategoryError('Category name must be at least 2 characters');
      return;
    }

    try {
      const { data } = await api.post('/api/categories', { name: trimmedName });
      setCategories([...categories, data]);
      setCategoryName('');
      setCategoryError(null);
      setSuccessMessage(`Category "${trimmedName}" created successfully.`);
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Failed to create category.');
    }
  };

  // Stats calculations
  const stats = {
    totalUsers: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
    categories: categories.length,
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Admin Dashboard</h1>
            <p>Manage users and categories for your recipe platform</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon users">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalUsers}</span>
                <span className="stat-label">Total Users</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon admins">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.admins}</span>
                <span className="stat-label">Admins</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon categories">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.categories}</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error" role="alert">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="alert">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l7.59-7.59L18 6l-9 9z" fill="currentColor"/>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
            <span>Users</span>
            <span className="badge">{stats.totalUsers}</span>
          </button>
          <button
            className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2l-4.5 7h9L10 2zm0 3.16L11.58 8H8.42L10 5.16zM14.5 11c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM3 17h6v-6H3v6zm2-4h2v2H5v-2z" fill="currentColor"/>
            </svg>
            <span>Categories</span>
            <span className="badge">{stats.categories}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === 'users' ? (
          <div className="users-section">
            <div className="section-header">
              <h2>User Management</h2>
              <p>View and manage all registered users</p>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <path d="M32 32c5.52 0 10-4.48 10-10S37.52 12 32 12s-10 4.48-10 10 4.48 10 10 10zm0 5c-6.67 0-20 3.35-20 10v5h40v-5c0-6.65-13.33-10-20-10z" fill="currentColor"/>
                </svg>
                <h3>No users yet</h3>
                <p>Users will appear here once they register</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.first_name[0]}{user.last_name[0]}
                            </div>
                            <div className="user-info">
                              <span className="user-name">
                                {user.first_name} {user.last_name}
                              </span>
                              <span className="user-id">ID: {user.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="email-text">{user.email}</span>
                        </td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 1L2 4v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8V4l-6-3zm0 7.33h4.67c-.35 2.75-2.19 5.19-4.67 5.95V8.33H3.33V4.87L8 2.54v5.79z" fill="currentColor"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 8c1.66 0 3-1.34 3-3S9.66 2 8 2 5 3.34 5 5s1.34 3 3 3zm0 1.5c-2 0-6 1-6 3V14h12v-1.5c0-2-4-3-6-3z" fill="currentColor"/>
                              </svg>
                            )}
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {user.role !== 'admin' && (
                              <button
                                className="btn-action promote"
                                onClick={() => handlePromote(user.id, `${user.first_name} ${user.last_name}`)}
                                title="Promote to Admin"
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M8 1L2 4v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8V4l-6-3z" fill="currentColor"/>
                                </svg>
                                Promote
                              </button>
                            )}
                            <button
                              className="btn-action delete"
                              onClick={() => handleDelete(user.id, `${user.first_name} ${user.last_name}`)}
                              title="Delete User"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V5H4v7zM13 3h-2.5l-1-1h-3l-1 1H3v2h10V3z" fill="currentColor"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="categories-section">
            <div className="section-header">
              <h2>Category Management</h2>
              <p>Create and manage recipe categories</p>
            </div>

            {/* Create Category Form */}
            <div className="create-category-card">
              <h3>Create New Category</h3>
              {categoryError && (
                <div className="alert alert-error" role="alert">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
                  </svg>
                  <span>{categoryError}</span>
                </div>
              )}
              <form onSubmit={handleCreateCategory} className="category-form">
                <div className="form-group">
                  <label htmlFor="categoryName">Category Name</label>
                  <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g., Desserts, Main Courses, Beverages"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5 11h-4v4H9v-4H5V9h4V5h2v4h4v2z" fill="currentColor"/>
                  </svg>
                  Create Category
                </button>
              </form>
            </div>

            {/* Categories Grid */}
            <div className="categories-grid">
              {categories.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M32 8l-18 28h36L32 8zm0 12.67L38.67 32H25.33L32 20.67zM46 42c-6.63 0-12 5.37-12 12s5.37 12 12 12 12-5.37 12-12-5.37-12-12-12zm0 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM10 58h20V38H10v20zm4-16h12v12H14V42z" fill="currentColor"/>
                  </svg>
                  <h3>No categories yet</h3>
                  <p>Create your first category to get started</p>
                </div>
              ) : (
                categories.map(category => (
                  <div key={category.id} className="category-item">
                    <div className="category-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L6.5 11h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="category-name">{category.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;