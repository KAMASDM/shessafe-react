import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PersonalProfile from './components/PersonalProfile';
import StoreAudioWords from './components/StoreAudioWords';
import VoiceRecognition from './components/VoiceRecognition';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<PersonalProfile />} />
        <Route path="/store-audio-words" element={<StoreAudioWords />} />
        <Route path="/voice-recognition" element={<VoiceRecognition />} />
      </Routes>
    </Router>
  );
}

export default App;
