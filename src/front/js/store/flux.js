const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			authToken: localStorage.getItem("authToken"),
			email: localStorage.getItem("email"),
			message: null
		},
		actions: {
			// Función para establecer el token de autenticación
			setAuthToken: (token) => {
				localStorage.setItem("authToken", token);
				setStore({ authToken: token });
			},
			// Función para establecer el correo electrónico del usuario
			setEmail: (email) => {
				localStorage.setItem("email", email);
				setStore({ email: email });
			},
			// Función para limpiar el token y el correo del localStorage y del contexto
			logout: () => {
				localStorage.removeItem("authToken");
				localStorage.removeItem("email");
				setStore({ authToken: null, email: null });
			}
		}
	};
};

export default getState;