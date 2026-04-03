import { addTodo, deleteTodo, getTodosList, updateTodo } from "./actions";
import type { Todo } from "./model";

export default async function HomePage(req: Request, layout: string) {
  const homePage = await Bun.file("./pages/home/index.html").text();

  if (req.method === "POST") {
    const data = await req.formData();
    const intent = data.get("intent");
    const id = data.get("id")?.toString() as string;
    const title = data.get("title")?.toString() as string;

    switch (intent) {
      case "add-todo":
        await addTodo({ title: title });
        break;

      case "delete-todo":
        if (id) {
          await deleteTodo(id);
        }
        break;

      case "update-todo":
        if (id) {
          await updateTodo({ id, title });
        }
    }

    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  }

  const todos: Array<Todo> = await getTodosList();

  const todosHtml = todos
    .map(
      (t) => `
    <li style="display:flex;flex-direction:row;aling-items:center">
      <span id="todo-title-${t.id}" style="display:block;">
        ${t.title}
      </span>
      <input id="todo-input-${t.id}" style="display:none" type="text" name="title" value="${t.title}" oninput="document.getElementById('hidden-todo-input-${t.id}').value = this.value">
      <div style="display:flex; flex-direction: row; justify-content: space-between; aling-items: center; margin-left: 1rem;">
        <form method="POST" style="display:inline">
          <button id="edit-btn-${t.id}" type="button" onclick="toggleTodoInput('todo-input-${t.id}', 'todo-title-${t.id}', 'update-btn-${t.id}', 'edit-btn-${t.id}')">Edit</button>
        </form>
        <form method="POST" style="display:inline" onsubmit="document.getElementById('hidden-todo-input-${t.id}').value = document.getElementById('todo-input-${t.id}').value">
          <input type="hidden" name="intent" value="update-todo">
          <input type="hidden" name="id" value="${t.id}">
          <input type="hidden" name="title" id="hidden-todo-input-${t.id}">
          <button id="update-btn-${t.id}" type="submit" style="display:none">Save</button>
        </form>
        <form method="POST" style="display:inline">
          <input type="hidden" name="id" value="${t.id}">
          <input type="hidden" name="intent" value="delete-todo">
          <button type="submit">Delete</button>
        </form>
      </div>
    </li>
  `,
    )
    .join("");

  const pageHtml = homePage.replace("{{LIST}}", todosHtml);
  const finalHtml = layout.replace("{{CONTENT}}", pageHtml);

  return new Response(finalHtml, {
    headers: { "Content-Type": "text/html" },
  });
}
