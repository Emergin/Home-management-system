// Tasks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [dailyTasks, setDailyTasks] = useState([]);
    const [priorityTasks, setPriorityTasks] = useState([]);
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

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const dailyResponse = await axios.get('http://localhost:5000/api/daily-tasks');
            const priorityResponse = await axios.get('http://localhost:5000/api/priority-tasks');
            setDailyTasks(dailyResponse.data);
            setPriorityTasks(priorityResponse.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleDailyTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/daily-tasks', newDailyTask);
            fetchTasks();
            setNewDailyTask({ taskName: '', time: '', frequency: 'daily' });
        } catch (error) {
            console.error('Error adding daily task:', error);
        }
    };

    const handlePriorityTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/priority-tasks', newPriorityTask);
            fetchTasks();
            setNewPriorityTask({ taskName: '', priority: '', deadline: '' });
        } catch (error) {
            console.error('Error adding priority task:', error);
        }
    };

    // Define handleDeleteDailyTask function
    const handleDeleteDailyTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/daily-tasks/${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting daily task:', error);
        }
    };

    // Define handleDeletePriorityTask function
    const handleDeletePriorityTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/priority-tasks/${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting priority task:', error);
        }
    };

    return (
        <div>
            <div>
                <h2>Daily Tasks</h2>
                <form onSubmit={handleDailyTaskSubmit}>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={newDailyTask.taskName}
                        onChange={(e) => setNewDailyTask({...newDailyTask, taskName: e.target.value})}
                        required
                    />
                    <input
                        type="time"
                        value={newDailyTask.time}
                        onChange={(e) => setNewDailyTask({...newDailyTask, time: e.target.value})}
                        required
                    />
                    <button type="submit">Add Daily Task</button>
                </form>

                {dailyTasks.map(task => (
                    <div key={task._id}>
                        <h3>{task.taskName}</h3>
                        <p>Time: {task.time}</p>
                        <button onClick={() => handleDeleteDailyTask(task._id)}>Delete</button>
                    </div>
                ))}
            </div>

            <div>
                <h2>Priority Tasks</h2>
                <form onSubmit={handlePriorityTaskSubmit}>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={newPriorityTask.taskName}
                        onChange={(e) => setNewPriorityTask({...newPriorityTask, taskName: e.target.value})}
                        required
                    />
                    <select
                        value={newPriorityTask.priority}
                        onChange={(e) => setNewPriorityTask({...newPriorityTask, priority: e.target.value})}
                        required
                    >
                        <option value="">Select Priority</option>
                        <option value="5min">5 minutes</option>
                        <option value="15min">15 minutes</option>
                        <option value="30min">30 minutes</option>
                        <option value="1hour">1 hour</option>
                    </select>
                    <button type="submit">Add Priority Task</button>
                </form>

                {priorityTasks.map(task => (
                    <div key={task._id}>
                        <h3>{task.taskName}</h3>
                        <p>Priority: {task.priority}</p>
                        <button onClick={() => handleDeletePriorityTask(task._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
