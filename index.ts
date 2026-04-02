import HomePage from "./pages/home";

const PORT = 3000;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      const page = await HomePage();
      return new Response(page, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    return new Response("Page not found");
  },
});

console.log(`Server start running in http://localhost:3000`);
