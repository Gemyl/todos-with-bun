import HomePage from "./pages/home";
import LoginPage from "./pages/login";

const PORT = 3000;
const layoutFile = Bun.file("index.html");
const layout = await layoutFile.text();

const server = Bun.serve({
  port: PORT,
  routes: {
    "/": async (req) => {
      return await HomePage(req, layout);
    },
    "/login": async (req) => {
      return await LoginPage(req, layout);
    },
  },
});

console.log(`Server start running in http://localhost:3000`);
