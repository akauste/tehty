//import { Todo } from '@/app/components/todo-item';
import { createKysely } from '@vercel/postgres-kysely';
import { Generated, Selectable, Insertable, Updateable } from 'kysely';

interface Database {
  todo: TodoTable;
}

const db = createKysely<Database>();

export async function allTodos() {
  return db.selectFrom('todo')
    .selectAll()
    .execute();
}

export async function userTodos(user_id: string) {
  return db.selectFrom('todo')
    .selectAll()
    .where('user_id', '=', user_id)
    .execute();
}

export async function addTodo(todo: NewTodo) {
  return db.insertInto('todo')
    .values({...todo, done: false, orderno: null})
    .returning(['todo_id'])
    .executeTakeFirstOrThrow();
}

export async function setTodoDone(todo_id: Number, done: boolean) {
  return db.updateTable('todo')
    .set({done})
    .where('todo_id', '=', todo_id)
    .execute();
}

export interface TodoTable {
  todo_id: Generated<Number>;
  orderno: number | null;
  user_id: string;
  task: string;
  done: boolean;
}

export type Todo = Selectable<TodoTable>
export type NewTodo = Insertable<TodoTable>
export type TodoUpdate = Updateable<TodoTable>