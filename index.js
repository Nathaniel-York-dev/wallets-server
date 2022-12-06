const path = require('path');
const express = require('express');
const sqliteHelper = require('./lib/entity/sqlite.entity');
const crypto = require('crypto');
const {SessionHelper} = require("./lib/helpers/session.helper");

require('dotenv').config({
    path: path.join(__dirname, '/environment/.env')
});

const manageDb = new sqliteHelper.SqliteHelper({
    path: `${process.env.DB_PATH}/${process.env.DB_NAME}.db`
});

const db = manageDb.db;
const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//Allowing CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Validate authorization header api key for all routes
app.use((req, res, next) => {
    if (req.headers.authorization === process.env.API_KEY) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
});

//CRUD for users table
//CREATE user
app.post('/users', (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) { return res.status(400).send('Missing email or password'); }
    const saltedPassword = saltAndPepper(password);
    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, saltedPassword], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error creating user',
                error
            });
        }
        res.status(201).send({
            message: 'User created successfully'
        });
    });
});

//READ user
app.get('/users/:id', (req, res) => {
    const {id} = req.params;
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (error, row) => {
        if(error){
            res.status(500).send({
                message: 'Error getting user',
                error
            });
        }
        res.status(200).send({
            message: 'User retrieved successfully',
            data: row
        });
    });
});

//UPDATE user
app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const {email, password, name} = req.body;
    if (!email || !password || !name) { return res.status(400).send('Missing email, password or name'); }
    const saltedPassword = saltAndPepper(password);
    db.run(`UPDATE users SET email = ?, password = ?, name = ? WHERE id = ?`, [email, saltedPassword, name, id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error updating user',
                error
            });
        }
        res.status(200).send({
            message: 'User updated successfully'
        });
    });
});

//DELETE user
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, [id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error deleting user',
                error
            });
        }
        res.status(200).send({
            message: 'User deleted successfully'
        });
    });
});

//CRUD for cards table
//CREATE card
app.post('/cards', (req, res) => {
const {number, cvv, name, exp_date, user_id} = req.body;
    if (!number || !cvv || !name || !exp_date || !user_id) { return res.status(400).send('Missing number, cvv, name, exp_date or user_id'); }
    db.run(`INSERT INTO cards (number, cvv, name, exp_date, user_id) VALUES (?, ?, ?, ?, ?)`, [number, cvv, name, exp_date, user_id], (error) => {
        if(error){
            return res.status(500).send({
                message: 'Error creating card',
                error
            });
        }
        return res.status(201).send({
            message: 'Card created successfully'
        });
    });
});

//READ card
app.get('/cards/:id', (req, res) => {
    const {id} = req.params;
    db.get(`SELECT * FROM cards WHERE id = ?`, [id], (error, row) => {
        if(error){
            res.status(500).send({
                message: 'Error getting card',
                error
            });
        }
        res.status(200).send({
            message: 'Card retrieved successfully',
            data: row
        });
    });
});

//UPDATE card
app.put('/cards/:id', (req, res) => {
    const {id} = req.params;
    const {number, cvv, user_id} = req.body;
    if (!number || !cvv || !user_id) { return res.status(400).send('Missing number, cvv or user_id'); }
    db.run(`UPDATE cards SET number = ?, cvv = ?, user_id = ? WHERE id = ?`, [number, cvv, user_id, id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error updating card',
                error
            });
        }
        res.status(200).send({
            message: 'Card updated successfully'
        });
    });

});

//DELETE card
app.delete('/cards/:id', (req, res) => {
    const {id} = req.params;
    db.run(`DELETE FROM cards WHERE id = ?`, [id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error deleting card',
                error
            });
        }
        res.status(200).send({
            message: 'Card deleted successfully'
        });
    });
});

//CRUD for transactions table
//CREATE transaction
app.post('/transactions', (req, res) => {
    const {amount, description, card_id, user_id} = req.body;
    if (!amount || !description || !card_id || !user_id) { return res.status(400).send('Missing amount, description, card_id or user_id'); }
    db.run(`INSERT INTO transactions (amount, description, card_id, user_id) VALUES (?, ?, ?, ?)`, [amount, description, card_id, user_id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error creating transaction',
                error
            });
        }
        res.status(201).send({
            message: 'Transaction created successfully'
        });
    });
});

//READ transaction
app.get('/transactions/:id', (req, res) => {
    const {id} = req.params;
    db.get(`SELECT * FROM transactions WHERE id = ?`, [id], (error, row) => {
        if(error){
            res.status(500).send({
                message: 'Error getting transaction',
                error
            });
        }
        res.send({
            message: 'Transaction retrieved successfully',
            data: row
        });
    });
});

//UPDATE transaction
app.put('/transactions/:id', (req, res) => {
    const {id} = req.params;
    const {amount, description, card_id, user_id} = req.body;
    if (!amount || !description || !card_id || !user_id) { return res.status(400).send('Missing amount, description, card_id or user_id'); }
    db.run(`UPDATE transactions SET amount = ?, description = ?, card_id = ?, user_id = ? WHERE id = ?`, [amount, description, card_id, user_id, id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error updating transaction',
                error
            });
        }
        res.status(200).send({
            message: 'Transaction updated successfully'
        });
    });
});

//DELETE transaction
app.delete('/transactions/:id', (req, res) => {
    const {id} = req.params;
    db.run(`DELETE FROM transactions WHERE id = ?`, [id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error deleting transaction',
                error
            });
        }
        res.status(200).send({
            message: 'Transaction deleted successfully'
        });
    });
});

//CRUD for Balance table
//CREATE balance
app.post('/balance', (req, res) => {
    const {amount, user_id} = req.body;
    if (!amount || !user_id) { return res.status(400).send('Missing balance or user_id'); }
    db.run(`INSERT INTO balance (amount, user_id) VALUES (?, ?)`, [amount, user_id], (error) => {
        if(error){
            return res.status(500).send({
                message: 'Error creating balance',
                error
            });
        }
        return res.status(201).send({
            message: 'Balance created successfully'
        });
    });
});

//READ balance
app.get('/balances/:id', (req, res) => {
    const {id} = req.params;
    db.get(`SELECT * FROM balances WHERE id = ?`, [id], (error, row) => {
        if(error){
            res.status(500).send({
                message: 'Error getting balance',
                error
            });
        }
        res.send({
            message: 'Balance retrieved successfully',
            data: row
        });
    });
});

//UPDATE balance
app.put('/balances/:id', (req, res) => {
    const {id} = req.params;
    const {balance, user_id} = req.body;
    if (!balance || !user_id) { return res.status(400).send('Missing balance or user_id'); }
    db.run(`UPDATE balances SET balance = ?, user_id = ? WHERE id = ?`, [balance, user_id, id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error updating balance',
                error
            });
        }
        res.status(200).send({
            message: 'Balance updated successfully'
        });
    });
});

//DELETE balance
app.delete('/balances/:id', (req, res) => {
    const {id} = req.params;
    db.run(`DELETE FROM balances WHERE id = ?`, [id], (error) => {
        if(error){
            res.status(500).send({
                message: 'Error deleting balance',
                error
            });
        }
        res.status(200).send({
            message: 'Balance deleted successfully'
        });
    });
});

//Session management
app.post('/login', (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) { return res.status(400).send('Missing email or password'); }
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (error, row) => {
        if(error){
            return res.status(500).send({
                message: 'Error getting user',
                error
            });
        }
        if(row && checkPassword(password, row.password)){
            delete row.password;
            row = {
                ...row,
                token: SessionHelper.createSession(row)
            }
            return res.status(200).send({
                message: 'User logged in successfully',
                data: row
            });
        } else {
            return res.status(401).send({
                message: 'Invalid email or password'
            });
        }
    });
});

// Manage Joins between tables
// Get all cards for a user
app.get('/users/:id/cards', (req, res) => {
    const {id} = req.params;
    db.all(`SELECT * FROM cards WHERE user_id = ?`, [id], (error, rows) => {
        if(error){
            res.status(500).send({
                message: 'Error getting cards',
                error
            });
        }
        res.status(200).send({
            message: 'Cards retrieved successfully',
            data: rows
        });
    });
});

// Get all transactions for a user
app.get('/users/:id/transactions', (req, res) => {
    const {id} = req.params;
    db.all(`SELECT * FROM transactions WHERE user_id = ?`, [id], (error, rows) => {
        if(error){
            res.status(500).send({
                message: 'Error getting transactions',
                error
            });
        }
        res.status(200).send({
            message: 'Transactions retrieved successfully',
            data: rows
        });
    });
});

// get transactions for a user with offset and limit
app.get('/users/:id/transactions/:offset/:limit', (req, res) => {
    const {id, offset, limit} = req.params;
    db.all(`SELECT * FROM transactions WHERE user_id = ? LIMIT ? OFFSET ?`, [id, limit, offset], (error, rows) => {
        if(error){
            res.status(500).send({
                message: 'Error getting transactions',
                error
            });
        }
        res.status(200).send({
            message: 'Transactions retrieved successfully',
            data: rows
        });
    });
});


// Get all transactions for a card
app.get('/cards/:id/transactions', (req, res) => {
    const {id} = req.params;
    db.all(`SELECT * FROM transactions WHERE card_id = ?`, [id], (error, rows) => {
        if(error){
            res.status(500).send({
                message: 'Error getting transactions',
                error
            });
        }
        res.status(200).send({
            message: 'Transactions retrieved successfully',
            data: rows
        });
    });
});

// Get all transactions for a user and a card
app.get('/users/:user_id/cards/:card_id/transactions', (req, res) => {
    const {user_id, card_id} = req.params;
    db.all(`SELECT * FROM transactions WHERE user_id = ? AND card_id = ?`, [user_id, card_id], (error, rows) => {
        if(error){
            res.status(500).send({
                message: 'Error getting transactions',
                error
            });
        }
        res.status(200).send({
            message: 'Transactions retrieved successfully',
            data: rows
        });
    });
});

// Get balance for a user
app.get('/users/:id/balance', (req, res) => {
    const {id} = req.params;
    db.get(`SELECT * FROM balance WHERE user_id = ?`, [id], (error, row) => {
        if(error){
            return res.status(500).send({
                message: 'Error getting balance',
                error
            });
        }
        return res.status(200).send({
            message: 'Balance retrieved successfully',
            data: row
        });
    });
});

manageDb.createTables().then(() => {
    console.log('Tables created');
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});

//Salt and pepper password
function saltAndPepper(password) {
    const salt = crypto.randomBytes(process.env.SALT*1).toString('hex');
    const pepper = crypto.randomBytes(process.env.PEPPER*1).toString('hex');
    //sha256 with crypto
    const hash = crypto.createHash('sha256').update(password).digest("base64");
    return `${salt}$${hash}$${pepper}`;
}

//Check if password is correct
function checkPassword(password, hash) {
    const [salt, hashedPassword ,pepper] = hash.split('$');
    const newHash = crypto.createHash('sha256').update(password).digest("base64");
    return newHash === hashedPassword;
}

