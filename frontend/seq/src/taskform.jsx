import React, { useState, useEffect } from 'react';
import axios from './axios'; // Ensure this path is correct and axios is properly configured

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    task_name: '',
    task_description: ''
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks', { // Assuming baseURL is set in axios
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message); // Only display the error message
    }
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
      setTaskData({ task_name: '', task_description: '' });
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/tasks/${editing}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(task => task.task_id === editing ? response.data : task));
      setEditing(null);
      setTaskData({ task_name: '', task_description: '' });
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  const handleDelete = async (task_id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${task_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove the deleted task from the local state
      setTasks(tasks.filter(task => task.task_id !== task_id));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const startEditing = (task) => {
    setEditing(task.task_id);
    setTaskData({ task_name: task.task_name, task_description: task.task_description });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      handleUpdate(e);
    } else {
      handleCreate(e);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>{editing ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="task_name"
            placeholder="Task Name"
            value={taskData.task_name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="task_description"
            placeholder="Task Description"
            value={taskData.task_description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>
            {editing ? 'Confirm Edit' : 'Create Task'}
          </button>
        </form>
      </div>
      <div style={styles.taskList}>
        <h3 style={styles.subtitle}>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p style={styles.noTasks}>No tasks available.</p>
        ) : (
          <ul style={styles.taskListItems}>
            {tasks.map(task => (
              <li key={task.task_id} style={styles.taskItem}>
                <h4 style={styles.taskName}>{task.task_name}</h4>
                <p style={styles.taskDescription}>{task.task_description}</p>
                <button onClick={() => startEditing(task)} style={styles.button}>Edit</button>
                <button onClick={() => handleDelete(task.task_id)} style={styles.button}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    background: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Consistent gradient
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Consistent shadow
  },
  form: {
    background: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Consistent shadow
    marginBottom: '20px'
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff7e5f' // Consistent color
  },
  subtitle: {
    marginBottom: '10px',
    fontSize: '20px',
    color: '#ff7e5f' // Consistent color
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    height: '100px'
  },
  button: {
    padding: '12px',
    margin: '5px',
    backgroundColor: '#ff7e5f', // Consistent button color
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#feb47b' // Consistent hover color
  },
  taskList: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Consistent shadow
  },
  taskListItems: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },
  taskItem: {
    marginBottom: '10px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    color: '#333'
  },
  taskName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  taskDescription: {
    fontSize: '16px',
    marginBottom: '10px'
  },
  noTasks: {
    textAlign: 'center',
    color: '#777'
  }
};

export default Task;
