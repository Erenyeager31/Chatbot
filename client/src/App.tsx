import { useState } from 'react'
import './App.css'
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Chatpage from './pages/Chatpage'
import { Provider } from "react-redux"
import store from '../redux/Store'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/chat' element={<Chatpage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
