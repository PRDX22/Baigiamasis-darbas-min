import React, { createContext, useState } from 'react';
import Home from './pages/home/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import UpdateUser from './pages/home/UpdateUser';
import AddGuest from './pages/home/AddGuest';
import EventsList from './pages/home/EventsList';

export const AuthContext = createContext();

function App() {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

	return (
		<AuthContext.Provider
			value={{ isLoggedIn: user ? true : false, user, setUser }}
		>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/update/:id' element={<UpdateUser />} />
				<Route path='/add' element={<AddGuest />} />
				<Route path='/events' element={<EventsList />} />
			</Routes>
		</AuthContext.Provider>
	);
}

export default App;
