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
    setBalance: `update "accounts" SET amount = $1 where account_number = $2`,
    addTransaction: `insert into transactions(account_number, amount, type, tdate) VALUES ($1, $2, $3, $4);`,
    getTransactionTotal: `select account_number, tdate, sum(amount) from transactions where account_number = $1 and type = $2 and tdate = $3 group by(account_number, tdate);`
}

let tTypes = {
    withdrawal: "withdrawal",
    deposit: "deposit",
}

let transactionHistory = [];

let demoTransaction = [
    {
        amount: 200,
        account: 991,
        type: tTypes.withdrawal,
        date: new Date().toLocaleDateString('en-US')
    },
    {
        amount: 200,
        account: 991,
        type: tTypes.withdrawal,
        date: new Date().toLocaleDateString('en-US')
    }
]

let dailyTotalOfType = (accountNum, tType) => {

}


function createError(status, msg){
    var errObj = {};
    errObj.statusCode = status || 500;
    errObj.error = msg;
    return errObj;
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
});

let sendBack = (res, retObj) => {
    if(retObj.statusCode){
       return res.status(retObj.statusCode).json({error: retObj.error});
    } else {
       return res.json(retObj);
    }
}

let makeAdjustment = (accountNum, amount, tType, callback) => {
    if(isNaN(parseInt(amount)) || (amount - parseInt(amount)) > 0 || amount < 0 ){
        //amount either isn't a number, has a decimal (change), or is negative
        callback(createError(400, "An invalid amount as been entered."))
        return;
    }
    let adjustmentAmount = parseInt(amount);
    client.query(queries.getAccount, [accountNum], (err, result) => {

        if (err) {
            callback(createError(500, "There was a critical error. Please sign in again."));
        } else {
            try{
                let acc = result.rows[0];
                let balance = acc.amount;
                //Per email, credit accounts are to be treated as though they have no limit
                if(tType === "withdrawal"){
                    //Check for 200 in transaction.  400 daily is checked later.
                    if(adjustmentAmount > 200){
                        callback(createError(400, "Invalid amount withdrawn."));
                        return;
                    }
                    //If we're doing a withdrawl, make the amount a negative
                    adjustmentAmount = adjustmentAmount * -1;
                } else if (tType === "deposit") {
                    if(adjustmentAmount > 1000){
                        callback(createError(400, "Deposits are limited to 1000 per transaction."));
                        return;
                    } else if (acc.type === "credit" && ((acc.amount + adjustmentAmount) > 0)){
                        callback(createError(400, "Amount deposited exceeds balance."));
                        return;
                    }
                }
                //Check if withdrawals are over 400.
                if(tType === tTypes.withdrawal){
                    client.query(queries.getTransactionTotal, [accountNum, tType, new Date().toLocaleDateString('en-US')], (err, totalResult) => {
                        if (err) {
                            callback(createError(500, "There was a critical error.  Please contact support."));
                            return;
                        } else {
                            //Adjust our balance, send to DB
                            if(totalResult.rows.length === 0 || (parseInt(totalResult.rows[0]['sum']) + adjustmentAmount) >= -400){
                                setBalance(adjustmentAmount, balance, accountNum, tType, callback)
                            } else {
                                callback(createError(400, "Withdrawals cannot exceed $400 per calendar day."));
                                return;
                            }
                        }
                    })
                } else {
                    //Adjust our balance, send to DB
                    setBalance(adjustmentAmount, balance, accountNum, tType, callback)
                }
            } catch (e) {
                callback(createError(500, "There was a critical error. Please contact support."));
            }
        }
    });
}

let setBalance = (adjustmentAmount, balance, accountNum, tType, callback) => {
    //Adjust balance
    let finBalance = balance + adjustmentAmount;

    client.query(queries.setBalance, [finBalance, accountNum], (err, result) => {
        if (err) {
            callback(createError(500, "There was a critical error.  Please contact support."));
            return;
        } else {
            //We've successfully changed the balance.  Add transaction history for withdrawal tracking.
            client.query(queries.addTransaction, [accountNum, adjustmentAmount, tType, new Date().toLocaleDateString('en-US')], (err, transRes) => {
                if(err){
                    callback(createError(500, "There was a critical error.  Please contact support."));
                    return;
                } else {
                    callback(result.rows)
                }
            })
        }
    });
}

app.post('/makeWithdrawal', (req, res) => {
    if(!req.body.account || !req.body.amount){
        res.status(400).json(createError(400, "No account number or amount provided."));
        return;
    } else {
        makeAdjustment(req.body.account, req.body.amount, "withdrawal",  function(retObj) {
            sendBack(res, retObj)
            return;
        })
    }

})

app.post('/makeDeposit', (req, res) => {
    if(!req.body.account || !req.body.amount){
        res.status(400).json(createError(400, "No account number or amount provided."));
    } else {
        makeAdjustment(req.body.account, req.body.amount, "deposit",  function(retObj) {
            sendBack(res, retObj)
        })
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})