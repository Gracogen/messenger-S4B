// App.jsx should:
// - Show Login page if user is NOT logged in
// - Show Dashboard page if user IS logged in

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import React from 'react'

const App = () => {
  return (
    <div>
      {/* <Dashboard /> */}
      <Login />
    </div>
  )
}

export default App
