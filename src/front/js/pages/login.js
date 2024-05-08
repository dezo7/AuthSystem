import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    // Efecto para verificar si el usuario ya está autenticado
    useEffect(() => {
        if (store.authToken) {
            navigate("/private"); // Redirige a la página privada si ya hay un token
        }
    }, [store.authToken, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const data = await response.json();
                actions.setAuthToken(data.token);  // Guarda el token
                actions.setEmail(email);           // Guarda el correo electrónico
                navigate("/private"); // Navega a la página privada tras un inicio de sesión exitoso
            } else {
                console.error("Error en el inicio de sesión");
            }
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Iniciar sesión</h2>
                            <form onSubmit={handleLogin}>
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
                                <button type="submit" className="btn btn-primary btn-block">Iniciar sesión</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;