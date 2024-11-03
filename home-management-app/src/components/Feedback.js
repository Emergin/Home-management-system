// Feedback.js
import React, { useState } from 'react';
import axios from 'axios';

const Feedback = () => {
    const [feedback, setFeedback] = useState({
        title: '',
        message: '',
        rating: 5,
        userId: localStorage.getItem('userId') // Retrieve userId from localStorage
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/feedback', feedback);
            alert('Feedback submitted successfully!');
            setFeedback({ title: '', message: '', rating: 5, userId: feedback.userId });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Feedback Form</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={feedback.title}
                    onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
                    required
                    style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
                />
                <textarea
                    placeholder="Your feedback"
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    required
                    style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', minHeight: '100px' }}
                />
                <select
                    value={feedback.rating}
                    onChange={(e) => setFeedback({ ...feedback, rating: parseInt(e.target.value) })}
                    style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
                >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
                <button type="submit" style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: 'white', fontSize: '16px', cursor: 'pointer' }}>
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default Feedback;
