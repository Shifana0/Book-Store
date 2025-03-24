import React from 'react'
import { Link } from 'react-router-dom'
import Theme from '../Pages/Theme'


function Navbar() {
  return (
    <div className='h-20 w-full bg-amber-800 flex items-center justify-between text-white overflow-x-hidden dark:bg-gray-900'>
        <h1 className='ml-10 text-2xl font-bold'>Books-Store</h1>

        <ul className='flex gap-10 font-bold '>
           <Link to={'/'}><li>Home</li></Link> 
           <Link to={'/cart'}><li>Cart</li></Link>
           <Link to={'/wishlist'}><li>Wishlist</li></Link>
        </ul>

        <Theme/>
    </div>
  )
}

export default Navbar