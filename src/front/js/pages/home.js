import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card">
						<div className="card-body">
							<h1 className="text-center mb-4">Sistema de Autenticación</h1>
							<div className="d-flex justify-content-between">
								<a href="/signup" className="btn btn-primary">Registro</a>
								<a href="/login" className="btn btn-primary">Iniciar sesión</a>
								<a href="/private" className="btn btn-primary">Privado</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);


};
