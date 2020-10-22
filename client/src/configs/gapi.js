import { GAPI_CLIENT_ID } from '@/utility/constants.js';

export function handleGapiLoad() {
	window.gapi.load('auth2', () => {
		window.auth2 = window.gapi.auth2.init({
			client_id: GAPI_CLIENT_ID,
			ux_mode : 'popup'
		});
	})
}

