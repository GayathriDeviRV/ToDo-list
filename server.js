const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'enter_pwd',
    database: 'todo_list',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

// Middleware for parsing JSON
app.use(bodyParser.json());

// Middleware for serving static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to ToDo List App');
});

app.get('/tasks', (req, res) => {
    // Fetch tasks from the database
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route to add a new task
app.post('/tasks', (req, res) => {
    const { task_name } = req.body;
    // Insert task into the database
    db.query('INSERT INTO tasks (task_name) VALUES (?)', [task_name], (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('Task added to database:', result);
        res.json({ id: result.insertId, task_name, completed: false });
    });
});

// Route to mark a task as completed or remove it
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { completed } = req.body;

    // If task is marked as completed, delete it from the database
    if (completed) {
        db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
            if (err) {
                console.error('Error deleting task:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            console.log('Task deleted:', result);
            res.json({ success: true });
        });
    } else {
        // Update task completion status if not marked as completed
        db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, taskId], (err, result) => {
            if (err) {
                console.error('Error updating task completion status:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            console.log('Task completion status updated:', result);
            res.json({ success: true });
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
