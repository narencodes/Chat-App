export let init = () => {
	if (!navigator.serviceWorker || !window.caches || !window.fetch) {
		return;
	}
	window.onload = () => {
		
		navigator.serviceWorker
			.register(`${location.origin}/sw.js`) // Will be served by the server
			.then(() => console.log('registered'))
	}
}