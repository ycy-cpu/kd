// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BasicLayout from './components/Layout'
import Home from './views/Home'
import InStorage from './views/InStorage'
import OutStorage from './views/OutStorage'
import Inventory from './views/Inventory'

function App() {
  return (
    <Router>
      <BasicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/in-storage" element={<InStorage />} />
          <Route path="/out-storage" element={<OutStorage />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </BasicLayout>
    </Router>
  )
}

export default App
