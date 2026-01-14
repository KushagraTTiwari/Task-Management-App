import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import Loader from '../components/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [limit] = useState(5);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTasks(currentPage, limit);
      setTasks(data.tasks || []);
      setTotalTasks(data.totalTasks || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [isAuthenticated, navigate, fetchTasks]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const totalPages = Math.ceil(totalTasks / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate due date to prevent past dates
    if (name === 'dueDate' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (selectedDate < today) {
        setFormError('Due date cannot be in the past');
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError(''); // Clear error when valid input
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      dueDate: '',
    });
    setFormError('');
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    // Validate due date is not in the past
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setFormError('Due date cannot be in the past');
        setSubmitting(false);
        return;
      }
    }

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        ...(formData.dueDate && { dueDate: formData.dueDate }),
      };

      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }

      setShowForm(false);
      setEditingTask(null);
      setFormError('');
      // Refresh current page or go to first page if current page becomes empty
      fetchTasks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return '#95a5a6';
      case 'in_progress':
        return '#3498db';
      case 'done':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  if (loading && tasks.length === 0) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Task Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-actions">
        <div className="filter-section">
          <label>Filter by Status: </label>
          <select value={filterStatus} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button onClick={handleCreateTask} className="create-btn">
          Create Task
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-card">
            <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
            {formError && <div className="error-message">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={submitting}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={submitting}
                />
              </div>
              <div className="form-actions">
                <button type="submit" disabled={submitting} className="submit-btn">
                  {submitting ? 'Saving...' : editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                    setFormError('');
                  }}
                  className="cancel-btn"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">No tasks found</div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              {task.dueDate && (
                <p className="task-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <div className="task-actions">
                <button
                  onClick={() => handleEditTask(task)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
