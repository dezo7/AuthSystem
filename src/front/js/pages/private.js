import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
    const { store } = useContext(Context);
    const { authToken, email } = store;
    const navigate = useNavigate();

    // Efecto para redirigir si no hay un token válido
    useEffect(() => {
        if (!authToken) {
            navigate("/login"); // Redirige a la página de login si no hay un token
        }
    }, [authToken, navigate]);  // Dependencias del efecto

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Privado</h2>
                            <form>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Correo Electrónico:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email || "No disponible"}
                                        disabled
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="authToken">Token:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="authToken"
                                        value={authToken || "No disponible"}
                                        disabled
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Private;
