import { createItem, deleteItem, readItems, updateItem } from "@directus/sdk";
import directus from "../../lib/directus";
import type { Todo } from "./model";

export async function getTodosList() {
  return (await directus.request(readItems("todos"))) as Array<Todo>;
}

export async function addTodo(item: Partial<Todo>) {
  await directus.request(createItem("todos", item));
}

export async function updateTodo(item: Todo) {
  await directus.request(updateItem("todos", item.id, { title: item.title }));
}

export async function deleteTodo(id: string) {
  await directus.request(deleteItem("todos", id));
}
