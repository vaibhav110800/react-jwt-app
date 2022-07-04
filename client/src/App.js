import { Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Register/Register";
import Login from "./components/Login/Login";
import UpdateUser from "./components/updateUser/updateUser";
import ChangePassword from "./components/ChangePassword/ChangePassword"

function App() {
	const user = localStorage.getItem("token"); // jwt token is stored in user browser and is set by login route

	return (
		<Routes>
			{/* {user && <Route path="/" exact element={<Main />} />} 
 			<Route path="/" element={<Navigate replace to="/login" />} /> */}
			<Route path="/" exact element={<Login />} />
			<Route path="/:id" exact element={user?<Main/> : <Login/>} />
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/updateUser/:id" exact element={user?<UpdateUser /> : <Login/>} />
			<Route path="/changePassword/:id" exact element={user?<ChangePassword /> : <Login/>} />
		</Routes>
	);
}

export default App;
