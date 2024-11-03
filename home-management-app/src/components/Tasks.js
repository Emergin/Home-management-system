import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Inline styles
const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333'
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
    },
    section: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
    },
    input: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px'
    },
    select: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px',
        backgroundColor: '#fff'
    },
    button: {
        padding: '10px 15px',
        borderRadius: '4px',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    taskItem: {
        border: '1px solid #eee',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '10px',
        backgroundColor: '#fafafa'
    },
    taskHeader: {
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#333'
    },
    taskDetail: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '5px'
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
        marginTop: '10px'
    }
};

const Tasks = () => {
    const navigate = useNavigate();
    const [dailyTasks, setDailyTasks] = useState([]);
    const [priorityTasks, setPriorityTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [newDailyTask, setNewDailyTask] = useState({
        taskName: '',
        time: '',
        frequency: 'daily'
    });

    const [newPriorityTask, setNewPriorityTask] = useState({
        taskName: '',
        priority: '',
        deadline: ''
    });

    const userId = localStorage.getItem('userId');

    const fetchTasks = useCallback(async () => {
        if (!userId) return;
        
        setLoading(true);
        try {
            const [dailyResponse, priorityResponse] = await Promise.all([
                axios.get(`http://localhost:5000/api/daily-tasks/${userId}`),
                axios.get(`http://localhost:5000/api/priority-tasks/${userId}`)
            ]);
            setDailyTasks(dailyResponse.data);
            setPriorityTasks(priorityResponse.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch tasks. Please try again later.');
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchTasks();
    }, [userId, navigate, fetchTasks]);

    const handleDailyTaskSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError('Please login to add tasks');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/daily-tasks', {
                ...newDailyTask,
                userId
            });
            await fetchTasks();
            setNewDailyTask({ taskName: '', time: '', frequency: 'daily' });
            setError('');
        } catch (error) {
            setError('Failed to add daily task. Please try again.');
            console.error('Error adding daily task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePriorityTaskSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError('Please login to add tasks');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/priority-tasks', {
                ...newPriorityTask,
                userId
            });
            await fetchTasks();
            setNewPriorityTask({ taskName: '', priority: '', deadline: '' });
            setError('');
        } catch (error) {
            setError('Failed to add priority task. Please try again.');
            console.error('Error adding priority task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId, type) => {
        if (!userId) return;

        setLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/${type}-tasks/${taskId}`);
            await fetchTasks();
            setError('');
        } catch (error) {
            setError(`Failed to delete ${type} task. Please try again.`);
            console.error(`Error deleting ${type} task:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = async (task, type) => {
        if (editingTask && editingTask.id === task._id) {
            setLoading(true);
            try {
                await axios.put(`http://localhost:5000/api/${type}-tasks/${task._id}`, {
                    ...editingTask,
                    userId
                });
                await fetchTasks();
                setEditingTask(null);
                setError('');
            } catch (error) {
                setError('Failed to update task. Please try again.');
                console.error('Error updating task:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setEditingTask({ ...task, id: task._id });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Task Management</h1>
            
            {error && (
                <div style={styles.error} role="alert">
                    {error}
                </div>
            )}

            <div style={styles.gridContainer}>
                {/* Daily Tasks Section */}
                <div style={styles.section}>
                    <h2 style={styles.header}>Daily Tasks</h2>
                    <form onSubmit={handleDailyTaskSubmit} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newDailyTask.taskName}
                            onChange={(e) => setNewDailyTask({...newDailyTask, taskName: e.target.value})}
                            required
                            style={styles.input}
                        />
                        <input
                            type="time"
                            value={newDailyTask.time}
                            onChange={(e) => setNewDailyTask({...newDailyTask, time: e.target.value})}
                            required
                            style={styles.input}
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                backgroundColor: loading ? '#90caf9' : '#1976d2'
                            }}
                        >
                            {loading ? 'Adding...' : 'Add Daily Task'}
                        </button>
                    </form>

                    {dailyTasks.map(task => (
                        <div key={task._id} style={styles.taskItem}>
                            {editingTask && editingTask.id === task._id ? (
                                <div style={styles.form}>
                                    <input
                                        type="text"
                                        value={editingTask.taskName}
                                        onChange={(e) => setEditingTask({
                                            ...editingTask,
                                            taskName: e.target.value
                                        })}
                                        style={styles.input}
                                    />
                                    <input
                                        type="time"
                                        value={editingTask.time}
                                        onChange={(e) => setEditingTask({
                                            ...editingTask,
                                            time: e.target.value
                                        })}
                                        style={styles.input}
                                    />
                                    <div style={styles.buttonContainer}>
                                        <button
                                            onClick={() => handleEditTask(task, 'daily')}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: '#ffa726'
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingTask(null)}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: '#ef5350'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 style={styles.taskHeader}>{task.taskName}</h3>
                                    <p style={styles.taskDetail}>Time: {task.time}</p>
                                    <p style={styles.taskDetail}>Created: {formatDate(task.createdAt)}</p>
                                    <p style={styles.taskDetail}>Frequency: {task.frequency}</p>
                                    <div style={styles.buttonContainer}>
                                        <button
                                            onClick={() => handleEditTask(task, 'daily')}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: '#ffa726'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id, 'daily')}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: '#ef5350'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Priority Tasks Section */}
                <div style={styles.section}>
                    <h2 style={styles.header}>Priority Tasks</h2>
                    <form onSubmit={handlePriorityTaskSubmit} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newPriorityTask.taskName}
                            onChange={(e) => setNewPriorityTask({...newPriorityTask, taskName: e.target.value})}
                            required
                            style={styles.input}
                        />
                        <select
                            value={newPriorityTask.priority}
                            onChange={(e) => setNewPriorityTask({...newPriorityTask, priority: e.target.value})}
                            required
                            style={styles.select}
                        >
                            <option value="">Select Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <input
                            type="date"
                            value={newPriorityTask.deadline}
                            onChange={(e) => setNewPriorityTask({...newPriorityTask, deadline: e.target.value})}
                            required
                            style={styles.input}
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                backgroundColor: loading ? '#90caf9' : '#1976d2'
                            }}
                        >
                            {loading ? 'Adding...' : 'Add Priority Task'}
                        </button>
                    </form>

                    {priorityTasks.map(task => (
                        <div key={task._id} style={styles.taskItem}>
                            {editingTask && editingTask.id === task._id ? (
                                <div style={styles.form}>
                                    <input
                                        type="text"
                                        value={editingTask.taskName}
                                        onChange={(e) => setEditingTask({
                                            ...editingTask,
                                            taskName: e.target.value
                                        })}
                                        style={styles.input}
                                    />
                                    <select
                                        value={editingTask.priority}
                                        onChange={(e) => setEditingTask({
                                            ...editingTask,
                                            priority: e.target.value
                                        })}
                                        style={styles.select}
                                    >
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={editingTask.deadline}
                                        onChange={(e) => setEditingTask({
                                            ...editingTask,
                                            deadline: e.target.value
                                        })}
                                        style={styles.input}
                                    />
                                    <div style={styles.buttonContainer}>
                                        <button
                                            onClick={() => handleEditTask(task, 'priority')}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: '#ffa726'
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingTask(null)}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: '#ef5350'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 style={styles.taskHeader}>{task.taskName}</h3>
                                    <p style={styles.taskDetail}>Priority: {task.priority}</p>
                                    <p style={styles.taskDetail}>Deadline: {formatDate(task.deadline)}</p>
                                    <p style={styles.taskDetail}>Created: {formatDate(task.createdAt)}</p>
                                    <p style={styles.taskDetail}>Status: {task.completed ? 'Completed' : 'Pending'}</p>
                                    <div style={styles.buttonContainer}>
                                        <button
                                            onClick={() => handleEditTask(task, 'priority')}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: '#ffa726'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id, 'priority')}
                                            style={{
                                                ...styles.button,
                                                backgroundColor: '#ef5350'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
