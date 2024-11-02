// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import ShoppingList from './components/ShoppingList';
import Tasks from './components/Tasks';
import Feedback from './components/Feedback';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shopping-list" element={<ShoppingList  />} />
                <Route path="/Tasks" element={<Tasks />} />
                <Route path="/feedback" element={<Feedback />} />

                {/* Add more routes as needed */}
                <Route path="/" element={<SignIn />} /> {/* Default route */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;