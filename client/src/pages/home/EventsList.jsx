import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import './home.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventsList = () => {
	const navigate = useNavigate();
	const { isLoggedIn, setUser } = useContext(AuthContext);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_SERVER_URI}events`
				);
				const data = await response.json();
				setUsers(data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUsers();
	}, []);

	const onUserLogout = () => {
		setUser(null);
		localStorage.clear();
		navigate('/login');
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
			<h1>All Events</h1>
			<div className='container'>
				<table>
					<thead>
						<tr>
							<th>Event Id</th>
							<th>Event Name</th>
							<th>Event date</th>
						</tr>
					</thead>

					<tbody>
						{users.map(({ id, title, date }) => {
							return (
								<tr key={id}>
									<td>{id}</td>
									<td>{title}</td>
									<td>{date.slice(0, 10)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default EventsList;
