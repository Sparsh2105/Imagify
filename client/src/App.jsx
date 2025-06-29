import React from 'react'
import Home from './pages/Home.jsx'
import Result from './pages/Result.jsx'
import BuyCredit from './pages/BuyCredit.jsx'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import AppContextProvider from './context/AppContext.jsx'
import Footer from './components/Footer.jsx'

const App = () => {
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 '>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/result' element={<Result />} />
        <Route path='/buy' element={<BuyCredit />} />
        </Routes>

        <Footer/>





    </div>
  )
}

export default App
