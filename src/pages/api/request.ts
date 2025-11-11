import type { APIRoute } from "astro";
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse and validate request body
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error("Invalid JSON in request body:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid request body. Expected valid JSON.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { name, email, message } = data;

    // Check for API key
    const apiKey = import.meta.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable is not configured");
      return new Response(
        JSON.stringify({
          error: "Server configuration error. Please contact support.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare request to external API
    const queryParams = new URLSearchParams({
      API_ROUTE_SECRET: apiKey,
    });
    const url = `https://dinis-e-carvalho-api.vercel.app/api/newLetter/imperador?${queryParams}`;

    const rawFormData = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    // Make request to external API
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rawFormData),
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `External API error (Status: ${response.status})`;

        console.error("External API error:", {
          status: response.status,
          message: errorMessage,
        });

        return new Response(
          JSON.stringify({
            error: "An unexpected error occurred. Please try again later.",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log("Successfully submitted newsletter request");

      return new Response(
        JSON.stringify({
          message: "Success! Your request has been submitted.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      console.error("Network error when calling external API:", fetchError);
      return new Response(
        JSON.stringify({
          error: "Network error. Please check your connection and try again.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (unexpectedError) {
    // Catch any unexpected errors
    console.error("Unexpected error in API route:", unexpectedError);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
