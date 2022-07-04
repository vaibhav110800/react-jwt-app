import React from 'react';
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";

function ChangePassword() {

    const [data, setData] = useState({ oldPassword: "", password: "" });
	const [error, setError] = useState("");
    const id = useParams().id;
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = `http://localhost:8080/changePassword/${id}`;
			const { data: res } = await axios.put(url, data);
			// localStorage.setItem("token", res.data.token);
			// const id=(res.data.user._id);
			window.location = `/${id}`;
			// console.log(res.data.user._id);
			// window.location = `/{res.data.user._id}`;
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

    return (
        <div>
            <div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Change Password</h1>
						<input
							type="password"
							placeholder="Old Password"
							name="oldPassword"
							onChange={handleChange}
							value={data.oldPassword}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="New Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Submit
						</button>
					</form>
				</div>
        </div>
    );
}

export default ChangePassword;