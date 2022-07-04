import { useEffect, useState } from 'react';
import {Box,Button,FormLabel,TextField} from "@mui/material";
import styles from "./styles.module.css";
import {Link, useNavigate,useParams } from "react-router-dom";
import axios from "axios";

function UpdateUser() {
    const [inputs, setInputs] = useState({});
	const id = useParams().id;
    
    const history = useNavigate();
  
    useEffect(() => {
        const fetchHandler = async () => {
        await axios
            .get(`http://localhost:8080/${id}`)  // get all data of users to fill input fields
            .then((res) => res.data)
            .then((data) => setInputs(data.user));
            // .then((data) => console.log(data.user));
            // all input tags are filed by prev
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios
        .put(`http://localhost:8080/updateUser/${id}`, {
            firstName: String(inputs.firstName),
            lastName: String(inputs.lastName),
            email: String(inputs.email),
            phone: Number(inputs.phone),
            dob: String(inputs.dob),
        })
        .then((res) => res.data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(() => history(`/${id}`));
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
        }));
    };

    const handleCancle=()=>{
		window.location = `/${id}`;
	}

    return (
        <div>
            {inputs && (
            <form onSubmit={handleSubmit}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent={"center"}
                    maxWidth={700}
                    alignContent={"center"}
                    alignSelf="center"
                    marginLeft={"auto"}
                    marginRight="auto"
                    marginTop={10}
                >
                    <FormLabel>First Name</FormLabel>
                    <TextField
                    type="text"
                    value={inputs.firstName}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    name="firstName"
                    />
                    
                    <FormLabel>Last Name</FormLabel>
                    <TextField
                    type="text"
                    value={inputs.lastName}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    name="lastName"
                    />

                    <FormLabel>E-mail</FormLabel>
                    <TextField 
                        type="email"
                        id="userEmail"
                        value={inputs.email}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        name="email"
                    />

                    <FormLabel>Age</FormLabel>
                    <TextField required
                        value={inputs.dob}
                        onChange={handleChange}
                        margin="normal"
                        type="date"
                        fullWidth
                        variant="outlined"
                        name="dob"
                    />

                    <FormLabel>Phone Number</FormLabel>
                    <TextField required
                        value={inputs.phone}
                        onChange={handleChange}
                        margin="normal"
                        type="number"
                        fullWidth
                        variant="outlined"
                        name="phone"
                    />

                    <div className="bottom-button">
                        <Button className="submit" style={{marginRight:"5px"}} variant="contained" type="submit">
                            Update User
                        </Button>
                        <Button className="submit" onClick={handleCancle} variant="contained">
                            Cancel
                        </Button>
                    </div>
                </Box>
            </form>
        )}
            </div>
    );
}

export default UpdateUser;