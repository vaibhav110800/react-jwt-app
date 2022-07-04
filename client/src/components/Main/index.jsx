import styles from "./styles.module.css";
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	backdrop: {
	  zIndex: theme.zIndex.drawer + 1,
	  color: '#fff',
	},
  }));

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");  //The removeItem() method removes the specified Storage Object item.
										   //The removeItem() method belongs to the Storage Object, which can be either
										   // a localStorage object or a sessionStorrage object.
		// window.location.reload();
	};

	//////////////////////////// get information of user ////////////////////////////
	const classes=useStyles();
	const [inputs, setInputs] = useState(null);
	const id = useParams().id;
	useEffect(() => {
		const fetchHandler =async () => {
			await axios 
			.get(`http://localhost:8080/${id}`) // get all data of users to fill input fields
			.then((res) => res.data)
			.then((data) => setInputs(data.user));
		//   .then((data) => console.log(data.user));
		};
		fetchHandler();
	  }, [id]);


	//////////////////////////// add phone and dob ////////////////////////////
	const [data, setData] = useState({
		phone:"",
		dob:""
	});
	const [error, setError] = useState("");
	const handleChange = ({ currentTarget: input }) => {// save data
		setData({ ...data, [input.name]: input.value });
	};
	const handleSubmit = async (e) => { //submit data
		e.preventDefault();
		try {
			const url = `http://localhost:8080/${id}`;
			const { data: res } = await axios.put(url, data);
			window.location.reload();
			console.log(res.message);
			setData({
				phone:" ",
				dob:" "
			})

		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	//////////////////////////// update ////////////////////////////

	const handleUpdate=()=>{
		window.location = `/updateUser/${id}`;
	}

	const handleChangePassword=()=>{
		window.location = `/changePassword/${id}`;
	}

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>User Profile</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					<Link to="/login" style={{textDecoration: 'none',color:'#3498DB'}}>LogOut</Link>
				</button>
			</nav>

			{inputs ? 
			<div className={styles.flex}>
				<div className={styles.left}>
					<div className={styles.leftinner}> 
						<h3>Name: {inputs.firstName} {inputs.lastName}</h3>
						<h3>email: {inputs.email}</h3>
						<h3>Phone: {inputs.phone} </h3>
						<h3>dob: {inputs.dob}</h3>
						<button className={styles.white_btn} onClick={handleUpdate} style={{marginTop:'8px'}}>
							Edit
						</button>
						<button className={styles.white_btn} onClick={handleChangePassword} style={{marginTop:'8px'}}>
							Change Password
						</button>
					</div>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Add Information</h1>
						<label htmlFor="">Phone Number</label>
						<input
							type="text"
							name="phone"
							onChange={handleChange}
							value={data.phone}
							className={styles.input}
						/>
						<label htmlFor="">Date of birth</label>
						<input
							type="date"
							name="dob"
							onChange={handleChange}
							value={data.dob}
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Submit
						</button>
					</form>
				</div>
			</div> :
			<Backdrop className={classes.backdrop} open>
				<CircularProgress color="inherit" />
		  	</Backdrop>
			}
			
		</div>
	);
};

export default Main;
