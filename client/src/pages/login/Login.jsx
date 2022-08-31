import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import './login.css';

const Login = () => {
	const navigate = useNavigate();
	const { setUser } = useContext(AuthContext);
	const [userData, setUserData] = useState({
		email: '',
		password: '',
	});
	const onFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URI}login`,
				{
					method: 'POST',
					body: JSON.stringify(userData),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const data = await response.json();
			if (data.err) return alert(data.err);
			setUser(data.user);
			localStorage.setItem('user', JSON.stringify(data.user));
			navigate('/');
		} catch (err) {
			alert(err);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<div className='container'>
				<form onSubmit={onFormSubmit}>
					<input
						type='email'
						name='email'
						id='email'
						onChange={(event) =>
							setUserData((prev) => ({
								...prev,
								email: event.target.value,
							}))
						}
						value={userData.email}
						required
					/>
					<input
						type='password'
						name='password'
						id='password'
						value={userData.password}
						onChange={(event) =>
							setUserData((prev) => ({
								...prev,
								password: event.target.value,
							}))
						}
						required
					/>
					<button type='submit'>Login</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
