const express = require('express')
const { Client } = require('pg');

const app = express()
app.use(express.json());

const port = 3000

const client = new Client({
    user: 'user',
    password: 'password',
    host: 'localhost',
    port: '5432',
    database: 'challenge',
});

const queries = {
    getAccount: `select * from accounts where account_number = $1`,
    setBalance: `update "accounts" SET amount = $1 where account_number = $2`

}

function createError(status, msg){
    var errObj = {};
    errObj.status = status || 500;
    errObj.body = {message: msg};
    return {
        status: status || 500,
        message: msg || "Internal Server Error"
    }
}

client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
});

app.post('/getAccount', (req, res) => {
    if(!req.body.accountNum){
        res.status(400).json(createError(400, "No account number provided."));
    }
    client.query(queries.getAccount, [req.body.accountNum], (err, result) => {
        if (err) {
            res.status(500).json(createError(500, "There was a critical error. Please sign in again."));
        } else {
            console.log('Query result:', result.rows);
            res.json( result.rows)
        }
    });
})

app.put('/makeDeposit', (req, res) => {
    if(!req.body.accountNum){
        res.status(400).json(createError(400, "No account number provided."));
    }
    client.query(queries.setBalance, [req.body.balance, req.body.accountNum], (err, result) => {
        if (err) {
            res.status(500).json(createError(500, "There was a critical error. Please sign in again."));
        } else {
            console.log('Query result:', result.rows);
            res.json( result.rows)
        }
    });
})

let makeAdjustment = (accountNum, amount, tType){
    client.query(queries.getAccount, [req.body.accountNum], (err, result) => {
        if (err) {
            res.status(500).json(createError(500, "There was a critical error. Please sign in again."));
        } else {
            try{
                var acc = result.rows[0];
                if(acc.type === "credit"){

                }
            } catch (e) {
                res.status(500).json(createError(500, "There was a critical error. Please sign in again."));
            }

        }
    });
}

app.post('/makeWithdrawal', (req, res) => {
    if(!req.body.accountNum || !req.body.accountNum){
        res.status(400).json(createError(400, "No account number provided."));
    }
    client.query(queries.setBalance, [req.body.balance, req.body.accountNum], (err, result) => {
        if (err) {
            res.status(500).json(createError(500, "There was a critical error. Please sign in again."));
        } else {
            console.log('Query result:', result.rows);
            res.json( result.rows)
        }
    });
})

app.get('/', (req, res) => {
    client.query(queries.getAccount, [req.body.accountNum], (err, result) => {
        if (err) {
            res.status(500).json(createError(500, "There was a critical error. Please sign in again."));
        } else {
            console.log('Query result:', result.rows);
            res.json( result.rows)
        }
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})