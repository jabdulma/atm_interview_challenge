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

let transactionHistory = [];

function createError(status, msg){
    let errObj = {};
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

let totalOfType = (accountNum, tType) => {
    return 0;
}

let makeAdjustment = (accountNum, amount, tType, callback) => {
    let adjustmentAmount = amount;

    client.query(queries.getAccount, [accountNum], (err, result) => {
        if (err) {
            res.status(500).json(createError(500, "There was a critical error. Please sign in again."));
        } else {
            try{
                let acc = result.rows[0];
                //Per email, credit accounts are to be treated as though they have no limit
                if(tType === "withdrawal"){
                    //Check for 200 in transaction, or 400 daily.
                    if(adjustmentAmount > 200 || totalOfType(accountNum, tType) > 400){
                        callback(createError(400, "Invalid amount withdrawn."));
                    }
                    //If we're doing a withdrawl, make the amount a negative
                    adjustmentAmount = tType === "withdrawawl" ? adjustmentAmount * -1 : adjustmentAmount;
                } else if (tType === "deposit") {
                    if(adjustmentAmount > 1000){
                        callback(createError(400, "Deposits are limited to 1000 per transaction."));
                    } else if (acc.type === "credit" && ((acc.amount + adjustmentAmount) > 0)){
                        callback(createError(400, "Amount deposited exceeds balance."));
                    }
                }
                client.query(queries.setBalance, [adjustmentAmount, accountNum], (err, result) => {
                    if (err) {
                        res.status(500).json(createError(500, "There was a critical error. Please sign in again."));
                    } else {
                        console.log("Adjustment Made: " + adjustmentAmount, accountNum);
                        console.log("Old amount: " + acc.amount);
                        res.json( result.rows)
                    }
                });

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