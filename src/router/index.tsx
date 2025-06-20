// src/router/index.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../views/Home'
import InStorage from '../views/InStorage'
import OutStorage from '../views/OutStorage'
import Inventory from '../views/Inventory'

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/in-storage" element={<InStorage />} />
        <Route path="/out-storage" element={<OutStorage />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
