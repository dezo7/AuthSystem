import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { store } = useContext(Context); // Utiliza el contexto para acceder al estado global

    // Efecto para redirigir si el usuario ya está autenticado
    useEffect(() => {
        if (store.authToken) {
            navigate("/private"); // Cambia esto por la ruta a la que deseas redirigir
        }
    }, [store.authToken, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                navigate("/login");
            } else {
                console.error("Error en el registro");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Registro</h2>
                            <form onSubmit={handleSignup}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Correo electrónico:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Contraseña:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Registrarse</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;