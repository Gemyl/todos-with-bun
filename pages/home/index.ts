export default async function HomePage() {
  const file = Bun.file("./pages/home/index.html");
  const html = await file.text();
  return html;
}
