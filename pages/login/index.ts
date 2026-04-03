export default async function LoginPage(req: Request, layout: string) {
  const loginHtml = await Bun.file("./pages/login/index.html").text();
  const totalHtml = layout.replace("{{CONTENT}}", loginHtml);
  return new Response(totalHtml, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
