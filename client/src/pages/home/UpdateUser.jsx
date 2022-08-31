import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import './home.css';

const UpdateGuest = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { isLoggedIn, setUser } = useContext(AuthContext);
	const [guestData, setGuestData] = useState({
		name: '',
		email: '',
		birthDate: '',
	});
	const onUserLogout = () => {
		setUser(null);
		localStorage.clear();
		navigate('/login');
	};

	useEffect(() => {
		const fetchGuests = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_SERVER_URI}guest/${Number(id)}`
				);
				const data = await response.json();
				setGuestData((prev) => ({
					...prev,
					name: data.name,
					email: data.email,
					birthDate: data.birthDate,
				}));
			} catch (err) {
				console.log(err);
			}
		};
		fetchGuests();
	}, [id]);

	const onFormSubmit = async (event) => {
		event.preventDefault();
		const guest = {
			name: guestData.name,
			email: guestData.email,
			birthDate: guestData.birthDate,
		};
		console.log(guestData);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_SERVER_URI}guest/${Number(id)}`,
				{
					method: 'PATCH',
					body: JSON.stringify(guest),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const data = await response.json();
			if (data.err) return alert('User is not updated!');
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
			<h2>Update User</h2>
			<div className='containerAdd'>
				<form onSubmit={onFormSubmit}>
					<input
						type='text'
						name='name'
						id='name'
						onChange={(event) =>
							setGuestData((prev) => ({
								...prev,
								name: event.target.value,
							}))
						}
						value={guestData.name}
						required
					/>
					<input
						type='email'
						name='email'
						id='email'
						onChange={(event) =>
							setGuestData((prev) => ({
								...prev,
								email: event.target.value,
							}))
						}
						value={guestData.email}
						required
					/>

					<input
						type='text'
						name='birthDate'
						id='birthDate'
						onChange={(event) =>
							setGuestData((prev) => ({
								...prev,
								birthDate: event.target.value,
							}))
						}
						value={guestData.birthDate}
						required
					/>
					<button type='submit'>Update</button>
				</form>
			</div>
		</div>
	);
};

export default UpdateGuest;
