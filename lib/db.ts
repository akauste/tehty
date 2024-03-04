import { createKysely } from '@vercel/postgres-kysely';
import { Generated } from 'kysely';

interface Database {
  todo: TodoTable;
}

const db = createKysely<Database>();

export async function allTodos() {
  return db.selectFrom('todo')
    .selectAll()
    .execute();
}

export async function setTodoDone(todo_id: Number, done: boolean) {
  return db.updateTable('todo')
    .set({done})
    .where('todo_id', '=', todo_id)
    .execute();
}

/*
const person = await db
  .selectFrom('todo')
  .innerJoin('pet', 'pet.owner_id', 'person.id')
  .select(['first_name', 'pet.name as pet_name'])
  .where('person.id', '=', id)
  .executeTakeFirst();
*/

export interface TodoTable {
  todo_id: Generated<Number>;
  orderno: number;
  user_id: string;
  task: string;
  done: boolean;
}