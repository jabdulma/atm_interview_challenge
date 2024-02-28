const pages = {
    login: "loginScreen",
    mainmenu: "mainMenu",
    withdrawal: "withdrawal",
    deposit: "deposit",
    givecash: "inbetweenWithdrawal",
    takecash: "inbetweenDeposit",
    balance: "checkBalance"
}

export function cleanCashNumber(val) {
    //Remove alphabet characters
    val = val.replace(/[a-zA-Z]/g, '')
    //Set empty string to 0
    val = val.length === 0 ? "0" : val;
    //Remove leading zeroes by converting to int
    val = parseInt(val, 10);
    return val;
}

export default pages