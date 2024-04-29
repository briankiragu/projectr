const API_URL = process.env["VITE_MUSIXMATCH_API_URL"];

export const GET = async (request: Request) => {
  const queryString = request.url.split("?").at(-1);
  const url = `${API_URL}/track.search?${queryString}`;

  try {
    // Make the request.
    const response = await fetch(url);

    // Check if the response is OK.
    if (!response.ok) {
      throw `Failed to make request: ${response.body}`;
    }

    // Return the response.
    return response;
  } catch (e) {
    return new Response(`Making request to URL ${url}`);
  }
};
