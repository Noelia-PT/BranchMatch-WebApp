// Proxy a OpenAI: la clave vive en .env (local) o en las variables de Netlify (producción).
export default async (req) => {
  const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: await req.text(),
  });

  return new Response(await respuesta.text(), {
    status: respuesta.status,
    headers: { "Content-Type": "application/json" },
  });
};
