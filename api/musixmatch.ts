const apiUrl: string = "https://api.musixmatch.com/ws/1.1";
const apiKey: string = "cc42f393e6c3711baa1f13a1adae18f2";

export const config = {
  runtime: "edge",
};

export default function GET() {
  // request: Request
  // const phrase: string = request.json();
  const phrase: string = "Lean on me";

  // Create the search params.
  const searchParams = new URLSearchParams({
    apiKey,
    q: encodeURIComponent(phrase),
  });

  // Make the request.
  // return fetch(`${apiUrl}/track.search?${searchParams.toString()}`);
  return new Response(`${apiUrl}/track.search?${searchParams.toString()}`);
}
