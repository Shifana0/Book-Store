import React, { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 
 const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();
 
   const handleSubmit = (e) => {
     e.preventDefault();
     const users = JSON.parse(localStorage.getItem('users') || '[]');
     const user = users.find((u) => u.email === email && u.password === password);
     if (user) {
       localStorage.setItem('authToken', 'dummy-token');
       navigate('/');
     } else {
       setError('Invalid credentials');
     }
   };
 
   return (
     <div className="flex justify-center items-center h-screen dark:bg-gray-900">
       <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded shadow w-96">
         <h2 className="text-2xl font-bold mb-4 dark:text-white">Login</h2>
         {error && <p className="text-red-500 mb-4">{error}</p>}
         <input
           type="email"
           placeholder="Email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
           required
         />
         <input
           type="password"
           placeholder="Password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
           required
         />
         <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
       </form>
     </div>
   );
 };
 
 export default Login;