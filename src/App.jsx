import React from 'react'
import {  BrowserRouter as Router, Routes ,Route } from 'react-router-dom'
import Home from '../src/Pages/Home'
import Cart from '../src/Pages/Cart'
import Wishlist from './Pages/Wishlist'
import Signup from './Pages/Signup'
import Login from './Pages/Login'

function App() {
  return (
   <>
   <Router>
    <Routes>
      <Route path='/'element={<Signup/>}/>
      <Route path='/home'element={<Home/>}/>
      
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/wishlist' element={<Wishlist/>}/>
    </Routes>
   </Router>
   {/* <Home/> */}
   </>
  )
}

export default App