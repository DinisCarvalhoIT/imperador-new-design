import type { APIRoute } from "astro";
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const name = data.name;
  const email = data.email;
  const message = data.message;

  const apiKey = import.meta.env.API_KEY;
  if (apiKey !== undefined) {
    const queryParams = new URLSearchParams({
      API_ROUTE_SECRET: apiKey,
    });
    const url = `https://dinis-e-carvalho-api.vercel.app/api/newLetter/imperador?${queryParams}`;
    console.log("url", url);
    const rawFormData = {
      name,
      email,
      message,
    };
    console.log("rawFormData", rawFormData);
    /* try {
      const dynamicData = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rawFormData),
      });
      if (!dynamicData.ok) {
        throw new Error(`Failed to fetch data. Status: ${dynamicData.status}`);
      } else {
        console.log("success newsLetter insert");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }*/
  } else {
    console.error("API_KEY is undefined");
    throw new Error("Failed to fetch data");
  }
  return new Response(
    JSON.stringify({
      message: "Success!",
    }),
    { status: 200 }
  );
};
