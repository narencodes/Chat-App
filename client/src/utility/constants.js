// Key to setting token to local storage
const TOKEN_KEY = 'auth_token';

const GAPI_CLIENT_ID = '504897852188-v3t8cp3d541u3u15vefn9cbqp9grq6q1.apps.googleusercontent.com'

// Constant url for image paths
let imgPath = `/img`;
const flagPath = `${imgPath}/indianflag.png`;
const dummyImg = `${imgPath}/dummy_image.png`;
const chatIcon = `${imgPath}/chat_icon.png`;

module.exports = {
	flagPath,
	TOKEN_KEY,
	dummyImg,
	chatIcon,
	GAPI_CLIENT_ID
}