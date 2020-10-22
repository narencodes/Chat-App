import axios from "axios";
import { TOKEN_KEY } from "../utility/constants"; 

export const setAxiosAuthorization = () => {
	let authToken = localStorage.getItem(TOKEN_KEY);
	if (!authToken) {
		return;
	}
	axios.defaults.headers.common['Authorization'] = authToken;
};

export const setTokenToStorage = authToken => {
	localStorage.setItem(TOKEN_KEY, authToken);
	setAxiosAuthorization();
};

let removeAuthHeader = () => {
	delete axios.defaults.headers.common['Authorization'];
}

export const removeTokenFromStorage  = () => {
	localStorage.removeItem(TOKEN_KEY);
	removeAuthHeader();
}