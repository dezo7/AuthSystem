import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);

	const handleLogout = () => {
		actions.logout();
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Sistema de Autenticación</span>
				</Link>
				<div className="ml-auto">
					{store.authToken ? (
						<button className="btn btn-primary" onClick={handleLogout}>
							Logout
						</button>
					) : (
						<Link to="/login" className="btn btn-primary">
							Login
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;