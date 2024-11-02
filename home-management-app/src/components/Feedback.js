// Feedback.js
import React, { useState } from 'react';
import axios from 'axios';

const Feedback = () => {
    const [feedback, setFeedback] = useState({
        title: '',
        message: '',
        rating: 5
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/feedback', feedback);
            alert('Feedback submitted successfully!');
            setFeedback({ title: '', message: '', rating: 5 });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div>
            <h2>Feedback Form</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={feedback.title}
                    onChange={(e) => setFeedback({...feedback, title: e.target.value})}
                    required
                />
                <textarea
                    placeholder="Your feedback"
                    value={feedback.message}
                    onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                    required
                />
                <select
                    value={feedback.rating}
                    onChange={(e) => setFeedback({...feedback, rating: parseInt(e.target.value)})}
                >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
                <button type="submit">Submit Feedback</button>
            </form>
        </div>
    );
};

export default Feedback;