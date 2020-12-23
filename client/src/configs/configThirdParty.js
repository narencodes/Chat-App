import axios from 'axios';

// To modify success response and error response
axios.interceptors.response.use(
	response => {
		if (response.data && response.data.data) {
			return response.data.data
		}
		return response.data || response;
	},
	response => {
		let error;
		if (!response.response) {
			error = {
				error: {
					message: response.message
				}
			};
		} else {
			error = response.response.data || response.response;
		}
		return Promise.reject(error);
	}
)