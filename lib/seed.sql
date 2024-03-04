CREATE TABLE todo (
    todo_id SERIAL,
    orderno INTEGER,
    user_id TEXT,
    task TEXT,
    done BOOLEAN,
    CONSTRAINT todo_pkey PRIMARY KEY (todo_id)   
);

INSERT INTO todo (user_id, task, done) VALUES ('aku.kauste@gmail.com', 'Test using Nextjs in vercel with postgres in neon and kysely as the sql lib', false);