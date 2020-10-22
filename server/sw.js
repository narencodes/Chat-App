// File for service worker
let cacheName = 'v1';

let dependencyURLs = [
	"https://kit.fontawesome.com/10806da71c.js",
	"https://apis.google.com/js/platform.js"
]

let handleInstall = e => {
	e.waitUntil(
		caches
			.open(cacheName)
			.then(cache => cache.addAll(dependencyURLs))
	);
}

self.addEventListener('install', handleInstall);


let handleActivate = e => {
	e.waitUntil(
		caches
			.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cache => {
						return cache !== cacheName && caches.delete(cache);
					})
				)
			})
	)
}

self.addEventListener('activate', handleActivate);


let handleFetch = e => {
	let { request } = e;
	if (!request.url.includes('http')) {
		return;
	}
	e.respondWith(
		fetch(request)
			.then(res => {
				let clone = res.clone();
				caches.open(cacheName)
					.then(cache => {
						cache.put(request.url, clone);
					})
				return res;
			})
			.catch(err => {
				caches
					.match(request.url, { ignoreVary : true })
					.then(res => res);
			})
	)
}

self.addEventListener('fetch', handleFetch);
