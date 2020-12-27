// File for service worker
let cacheName = 'v2';

let dependencyURLs = [
	"https://kit.fontawesome.com/10806da71c.js",
	"https://apis.google.com/js/platform.js"
]

let handleInstall = e => {
	self.skipWaiting();
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

let getValueFromCache = url => {
	return caches
			.match(url, { ignoreVary : true })
			.then(res => res);
}


let handleFetch = async(e) => {
	let { request } = e;
	if (!request.url.includes('http') || request.method !== 'GET' ) { // Ignore requests other than GET
		return;
	}
	if (request.url.includes('upload')) {
		return e.respondWith(
				getValueFromCache(request.url)
					.then(data => {
						if (data) {
							return data;
						}
						return fetchFromServer(request);
					})
					.catch(() => fetchFromServer(request))
		)
	}
	e.respondWith(fetchFromServer(request));
}

let fetchFromServer = request => {
	return fetch(request)
			.then(res => {
				let clone = res.clone();
				caches
					.open(cacheName)
					.then(cache => {
						cache.put(request.url, clone);
					})
				return res;
			})
			.catch(err => {
				return Promise.reject(err)
			})
}

self.addEventListener('fetch', handleFetch);
