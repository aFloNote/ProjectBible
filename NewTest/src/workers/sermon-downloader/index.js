
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Parse the URL of the incoming request
  const url = new URL(request.url);

  // Check if the "download" query parameter is present and true
  console.log('here')
  console.log(url.searchParams.get('download') === 'true')
  if (url.searchParams.get('download') === 'true') {
    // Fetch the original file/content from your server or storage
    const response = await fetch(request);

    // Create a new response with the "Content-Disposition" header set to force download
    const headers = new Headers(response.headers);
    headers.set('Content-Disposition',  `attachment; filename=${fileName[fileName.length - 1]}`);

    return new Response(response.body, {
      ...response,
      headers
    });
  }

  // If not a download request, just fetch and return the original content without modification
  return fetch(request);
}