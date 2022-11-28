function update(request) {
  return fetch(request.url).then(
    (response) =>
      cache(request, response) // we can put response in cache
        .then(() => response) // resolve promise with the Response object
  );
}

function refresh(response) {
  return response
    .json() // read and parse JSON response
    .then(jsonResponse => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          // report and send new data to client
          client.postMessage(
            JSON.stringify({
              type: response.url,
              data: jsonResponse.data
            })
          );
        });
      });
      return jsonResponse.data; // resolve promise with new data
    });
}


self.addEventListener("install", function (e) {
  // This event will be fired once when this version of the script is first registered for
  // a given URL scope.
  // It's an opportunity to initialize caches and prefetch data, if desired. This sort of
  // work should be wrapped in a Promise, and e.waitUntil(promise) can be used to ensure that
  // this installation does not complete until the Promise is settled.
  // Also, be aware that there may already be an existing service worker controlling the page
  // (either an earlier version of this script or a completely different script.)
  console.log("Install event:", e);
});

self.addEventListener("activate", function (e) {
  // This event will be fired once when this version of the script is first registered for
  // a given URL scope.
  // It's an opportunity to clean up any stale data that might be left behind in self.caches
  // by an older version of this script.
  // e.waitUntil(promise) is also available here to delay activation until work has been performed,
  // but note that waiting within the activate event will delay handling of any
  // fetch or message events that are fired in the interim. When possible, do work during the install phase.
  // It will NOT be fired each time the service worker is revived after being terminated.
  // To perform an action when the service worker is revived, include that logic in the
  // `onfetch` or `onmessage` event listeners.
  console.log("Activate event:", e);
});

self.addEventListener("fetch", (event) => {
  console.log(event.request.url)
  // if (event.request.url.includes("https://dummyjson.com/")) {
  //   // response to API requests, Cache Update Refresh strategy
  //   event.respondWith(caches.match(event.request));
  //   event.waitUntil(update(event.request)).then(refresh); //TODO: refresh
  // } else {
  //   // response to static files requests, Cache-First strategy
  // }
});
