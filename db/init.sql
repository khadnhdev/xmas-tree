CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
); 