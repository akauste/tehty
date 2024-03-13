CREATE TABLE todo (
    todo_id SERIAL,
    orderno INTEGER,
    user_id TEXT,
    task TEXT,
    done BOOLEAN,
    CONSTRAINT todo_pkey PRIMARY KEY (todo_id)   
);

INSERT INTO todo (user_id, task, done) 
    VALUES ('aku.kauste@gmail.com', 'Test using Nextjs in vercel with postgres in neon and kysely as the sql lib', false);

CREATE TABLE board (
    board_id SERIAL,
    orderno INTEGER,
    user_id TEXT,
    name TEXT,
    background_color TEXT,
    show BOOLEAN,
    showDoneTasks BOOLEAN,
    CONSTRAINT board_pkey PRIMARY KEY (board_id)
);
CREATE INDEX IF NOT EXISTS board_user_order ON board (
    user_id, 
    orderno
);
INSERT INTO board 
    (orderno, user_id, name, background_color, show, show_done_tasks)
VALUES 
    (1, 'aku.kauste@gmail.com', 'Planned', '#94a3b8', true, true),
    (2, 'aku.kauste@gmail.com', 'Active', '#60a5fa', true, true),
    (3, 'aku.kauste@gmail.com', 'Testing', '#fbbf24', true, true),
    (4, 'aku.kauste@gmail.com', 'Done', '#a3e635', true, true);

CREATE TABLE task (
    task_id SERIAL,
    board_id INTEGER REFERENCES board (board_id) ON DELETE SET NULL (board_id),
    orderno INTEGER,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    background_color TEXT,
    description TEXT,
    due_date DATE,
    done BOOLEAN,
    CONSTRAINT task_pkey PRIMARY KEY (task_id)
);
CREATE INDEX IF NOT EXISTS task_by_board ON board (
    board_id, 
    orderno
);
