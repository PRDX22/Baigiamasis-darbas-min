import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../App';
import './home.css';

const AddGuest = () => {
	const navigate = useNavigate();
	const { isLoggedIn, setUser } = useContext(AuthContext);

	const [userData, setUserData] = useState({
		eventsId: '',
		name: '',
		email: '',
		birthDate: '',
	});
	const onUserLogout = () => {
		setUser(null);
		localStorage.clear();
		navigate('/login');
	};
	const onFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URI}add`,
				{
					method: 'POST',
					body: JSON.stringify(userData),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const data = await response.json();
			if (data.err) return alert('User is not created!');
			navigate('/');
		} catch (err) {
			alert(err);
		}
	};

	return (
		<div>
			<div className='logout'>
				{isLoggedIn && (
					<button id='logout'>
						<Link to={`/`}>Home</Link>
					</button>
				)}

				{isLoggedIn && (
					<button id='logout' onClick={onUserLogout}>
						Logout
					</button>
				)}
			</div>
			<h2>Add guest</h2>
			<div className='containerAdd'>
				<form onSubmit={onFormSubmit}>
					<input
						type='text'
						name='eventsId'
						id='eventsId'
						onChange={(event) =>
							setUserData((prev) => ({
								...prev,
								eventsId: event.target.value,
							}))
						}
						placeholder='Event ID'
						required
					/>

					<input
						type='text'
						name='name'
						id='name'
						onChange={(event) =>
							setUserData((prev) => ({
								...prev,
								name: event.target.value,
							}))
						}
						placeholder='Name'
						required
					/>
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
						placeholder='E-mail'
						required
					/>
					<input
						type='text'
						name='birthDate'
						id='birthDate'
						placeholder='Date-of-birth'
						onChange={(event) =>
							setUserData((prev) => ({
								...prev,
								birthDate: event.target.value,
							}))
						}
						required
					/>
					<button type='submit'>ADD</button>
				</form>
			</div>
		</div>
	);
};

export default AddGuest;
