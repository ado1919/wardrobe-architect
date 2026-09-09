export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("WARDROBE ARCHITECT VISION READY");
    }

    const body = await request.json();

    const result = await env.AI.run(
      "@cf/meta/llama-3.2-11b-vision-instruct",
      {
        messages: [
          {
            role: "user",
            content:
              "Analyze this fashion item. Identify the garment type, color, pattern, material if visible, fit if worn, and the most important styling details."
          }
        ],
        image: body.image
      }
    );

    return Response.json(result);
  }
};
