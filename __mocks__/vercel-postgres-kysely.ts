import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export function createKysely<Database>() {
  //'postgres://myuser:mypassword@localhost:5432/mydb?sslmode=require'
  const dialect = new PostgresDialect({
    pool: new Pool({
      database: "mydb",
      host: "127.0.0.1",
      user: "myuser",
      port: 5432,
      password: "mypassword",
      max: 10,
    }),
  });
  return new Kysely<Database>({ dialect });
}
