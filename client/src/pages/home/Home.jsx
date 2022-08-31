import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import './home.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
	const navigate = useNavigate();
	const { isLoggedIn, setUser } = useContext(AuthContext);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_SERVER_URI}guests`
				);
				const data = await response.json();
				setUsers(data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUsers();
	}, []);

	const onDelete = async (id) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URI}guest/${id}`,
				{
					method: 'DELETE',
				}
			);
			const data = await response.json();
			if (data.affectedRows > 0) {
				setUsers((prev) => prev.filter((user) => user.id !== id));
			}
		} catch (err) {
			console.log(err);
		}
	};

	const onUserLogout = () => {
		setUser(null);
		localStorage.clear();
		navigate('/');
	};

	return (
		<div>
			<div className='logout'>
				{isLoggedIn && (
					<button id='logout'>
						<Link to={`/events`}>Events List</Link>
					</button>
				)}

				{isLoggedIn && (
					<button id='logout' onClick={onUserLogout}>
						Logout
					</button>
				)}
			</div>
			<h1>Registered guests</h1>
			<div className='container'>
				<table>
					<thead>
						<tr>
							<th>Guest Id</th>
							{isLoggedIn && <th>Email</th>}
							<th>Name</th>
							<th>Date of Birth</th>
							<th>Event</th>
							<th>Event date</th>
						</tr>
					</thead>

					<tbody>
						{users.map(
							({ id, email, name, birthDate, title, date }) => {
								return (
									<tr key={id}>
										<td>{id}</td>
										{isLoggedIn && <td>{email}</td>}
										<td>{name}</td>
										<td>{birthDate.slice(0, 10)}</td>
										<td>{title}</td>
										<td>{date.slice(0, 10)}</td>

										{isLoggedIn && (
											<td>
												<Button
													variant='info'
													size='sm'
												>
													<Link to={`/update/${id}`}>
														Update
													</Link>
												</Button>
											</td>
										)}
										{isLoggedIn && (
											<td>
												<Button
													variant='danger'
													size='sm'
													onClick={() => onDelete(id)}
												>
													Delete
												</Button>
											</td>
										)}
									</tr>
								);
							}
						)}
					</tbody>
				</table>
			</div>
			<div className='add'>
				<Button variant='info' size='m'>
					<Link to={`/add`}>Add guest</Link>
				</Button>
			</div>
		</div>
	);
};

export default Home;
