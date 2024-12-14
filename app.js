require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { OpenAI } = require('openai');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Khởi tạo database
const db = new sqlite3.Database('./db/cards.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the cards database.');
});

// Khởi tạo database schema
const initSQL = fs.readFileSync('./db/init.sql', 'utf8');
db.exec(initSQL);

// Khởi tạo OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/card/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM cards WHERE id = ?', [id], (err, card) => {
        if (err || !card) {
            return res.status(404).render('404');
        }
        res.render('card', { card });
    });
});

app.post('/generate-ai-message', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Bạn là một chuyên gia viết lời chúc Giáng sinh. Hãy viết một lời chúc Giáng sinh ấm áp, độ dài khoảng 2-3 câu."
                },
                {
                    role: "user",
                    content: "Viết lời chúc Giáng sinh"
                }
            ],
            model: "gpt-4o-mini",
        });

        res.json({ message: completion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Không thể tạo lời chúc' });
    }
});

app.post('/publish', (req, res) => {
    const { message, customId } = req.body;
    let id = customId ? customId.trim() : nanoid(10);
    
    // Kiểm tra customId hợp lệ
    if (customId) {
        if (!/^[a-zA-Z0-9-_]+$/.test(customId)) {
            return res.status(400).json({ error: 'Link tùy chỉnh chỉ được chứa chữ cái, số và dấu - _' });
        }
        if (customId.length < 3 || customId.length > 50) {
            return res.status(400).json({ error: 'Độ dài link phải từ 3-50 ký tự' });
        }
    }
    
    // Kiểm tra xem ID đã tồn tại chưa
    db.get('SELECT id FROM cards WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi hệ thống' });
        }
        if (row) {
            return res.status(400).json({ error: 'Link này đã được sử dụng' });
        }
        
        // Lưu thiệp mới
        db.run('INSERT INTO cards (id, message) VALUES (?, ?)', [id, message], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Không thể lưu thiệp' });
            }
            res.json({ id });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 