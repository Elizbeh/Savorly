import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import api from '../services/api';

/**
 * AdminDashboard Component
 * 
 * Provides administrative functionality for:
 * - Managing users (view, promote, delete)
 * - Creating categories
 * - Viewing all categories
 * 
 * Fully accessible with ARIA labels and keyboard navigation
 */
const AdminDashboard = () => {
  // State Management
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const navigate = useNavigate();

  /**
   * Fetch all users on component mount
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/admin/users');
        console.log('Users fetched:', data);
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

  /**
   * Fetch all categories on component mount
   */
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

  /**
   * Auto-dismiss success/error messages after 5 seconds
   */
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

  /**
   * Handle user deletion
   */
  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      setSuccessMessage(`User "${userName}" has been deleted successfully.`);
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      setError(
        `Failed to delete user: ${err.response?.data?.message || err.message}`
      );
    }
  };

  /**
   * Handle user promotion to admin
   */
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
      setSuccessMessage(`User "${userName}" has been promoted to Admin.`);
    } catch (err) {
      console.error('Promote error:', err.response?.data || err.message);
      setError(
        `Failed to promote user: ${err.response?.data?.message || err.message}`
      );
    }
  };

  /**
   * Handle category creation
   */
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
      console.error('Create category error:', err);
      setCategoryError(
        err.response?.data?.message || 'Failed to create category.'
      );
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard" role="main" aria-labelledby="dashboard-title">
      {/* Header */}
      <header className="admin-header">
        <h1 id="dashboard-title">Admin Dashboard</h1>
      </header>

      {/* Error Messages */}
      {error && (
        <div className="error-message" role="alert" aria-live="polite">
          <p>{error}</p>
        </div>
      )}

      {/* Success Messages */}
      {successMessage && (
        <div
          className="success-message"
          role="status"
          aria-live="polite"
          style={{
            background: 'var(--success-light)',
            borderLeft: '5px solid var(--success)',
            padding: '1.25rem 1.75rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <p
            style={{
              color: 'var(--success-text)',
              fontWeight: 600,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            ✓ {successMessage}
          </p>
        </div>
      )}

      {/* Category Creation Form */}
      <section
        className="category-form"
        aria-labelledby="category-form-title"
      >
        <h2 id="category-form-title">Create New Category</h2>

        {categoryError && (
          <div className="error-message" role="alert" aria-live="polite">
            <p>{categoryError}</p>
          </div>
        )}

        <form onSubmit={handleCreateCategory} noValidate>
          <div className="form-label-input">
            <label htmlFor="categoryName">
              Category Name <span aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Desserts, Main Courses"
              required
              aria-required="true"
              aria-invalid={categoryError ? 'true' : 'false'}
              aria-describedby={categoryError ? 'category-error' : undefined}
            />
          </div>
          <button
            type="submit"
            aria-label="Create new category"
          >
            Create Category
          </button>
        </form>
      </section>

      {/* User List */}
      <section className="user-list" aria-labelledby="users-title">
        <h2
          id="users-title"
          style={{
            padding: '1.5rem 1.5rem 0',
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}
        >
          Manage Users
        </h2>

        {loading ? (
          <p
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-muted)'
            }}
          >
            Loading users...
          </p>
        ) : users.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-muted)'
            }}
          >
            No users found.
          </p>
        ) : (
          <table role="table" aria-label="User management table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      role="status"
                      aria-label={`User role: ${user.role}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() =>
                          handlePromote(
                            user.id,
                            `${user.first_name} ${user.last_name}`
                          )
                        }
                        aria-label={`Promote ${user.first_name} ${user.last_name} to admin`}
                      >
                        Promote to Admin
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleDelete(
                          user.id,
                          `${user.first_name} ${user.last_name}`
                        )
                      }
                      aria-label={`Delete user ${user.first_name} ${user.last_name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Category List */}
      <section className="category-list" aria-labelledby="categories-title">
        <h2 id="categories-title">Existing Categories</h2>
        <ul role="list" aria-label="List of recipe categories">
          {categories.length === 0 ? (
            <li role="listitem">No categories found.</li>
          ) : (
            categories.map(category => (
              <li key={category.id} role="listitem">
                {category.name}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;