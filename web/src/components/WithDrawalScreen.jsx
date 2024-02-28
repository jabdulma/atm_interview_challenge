import {useEffect, useState} from 'react'

import {Button, InputAdornment, Paper, TextField} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import PropTypes from 'prop-types';
import pages from '../globals';
import {cleanCashNumber} from "../globals";
import PhoneButtons from "./PhoneButtons.jsx";

import ErrorDialog from "./ErrorDialog.jsx";
import axios from 'axios';

const WithDrawalScreen = ({accountData, nav}) => {
    //withdrawl state
    const [withdrawalAmount, setWD] = useState("0");
    const [errorOpen, setErrorOpen] = useState(false);
    const [errMsg, setErrMsg] = useState("")

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        nav.setTitle("Withdrawal Funds")
        setWD(0)
    }, []);


    function handleWithdrawalChange(e) {
        //Normally values are intercepted at keypress, but by using a "cleaning" function
        //we get to keep things like select all and delete key combinations easily.
        let wamount = e.target.value;
        setWD(cleanCashNumber(wamount))
    }

    function getCashButton() {
        getCash();
    }

    function quickCashButton(amt) {
        setWD(amt);
        getCash(amt);
    }

    function getCash(amountOverride) {
        let wdAmount = amountOverride || withdrawalAmount;
        //Local Error Handling
        if (withdrawalAmount % 5 > 0) {
            setErrMsg("Please enter a value divisible by 5");
            setErrorOpen(true);
            return;
        } else if (withdrawalAmount > 200) {
            setErrMsg("Withdrawls cannot exceed 200 in a single transaction.");
            setErrorOpen(true);
            return;
        }
        axios.post("/api/makeWithdrawal", {
            account: accountData.account_number,
            amount: wdAmount
        }).then((res) => {
            nav.setPage(pages.givecash);
            nav.updateAccount();
        }).catch((error) => {
            setErrMsg("There was an error, please try again. " + error.response?.data?.error);
            setErrorOpen(true);
        })
    }

    function cancelOut() {
        nav.setPage(pages.mainmenu);
    }

    return (
        <Box name="withdrawal" sx={{bgcolor: '#cfe8fc', width: '700px', height: '500px', alignItems: "center"}}>
            <Box sx={{paddingTop: '50px', flexGrow: 1}}>Please enter a withdrawl amount in multiples of 5, or select a
                quick cash option below: </Box>
            <Box display="flex"
                 justifyContent="center"
                 alignItems="center" sx={{paddingTop: '50px'}}>
                <Grid container rowSpacing={1} columnSpacing={{xs: 1}}>
                    <Grid xs={1}></Grid>
                    <Grid container xs={4} rowSpacing={1} columnSpacing={{xs: 0}}>
                        <PhoneButtons inVal={withdrawalAmount} setAmount={setWD}/>
                    </Grid>
                    <Grid xs={1}></Grid>
                    <Grid xs={5}>
                        <Stack>
                            <Paper sx={{width: '100%'}}>
                                <TextField fullWidth
                                           InputProps={{
                                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                               endAdornment: <InputAdornment position="end">.00</InputAdornment>,
                                               textalign: 'right'
                                           }}
                                           value={withdrawalAmount}
                                           onChange={handleWithdrawalChange}
                                           variant="filled"
                                           label="Withdrawal Amount"/>
                            </Paper>
                            <Button sx={{marginTop: '20px'}} onClick={getCashButton} variant="contained" size="large">Get
                                Cash</Button>
                            <Button sx={{marginTop: '20px'}} onClick={cancelOut} variant="contained"
                                    size="large">Cancel</Button>
                        </Stack>

                    </Grid>
                    <Grid xs={1}></Grid>
                    <Grid xs={1}></Grid>
                    <Grid xs={10} container sx={{paddingTop: '40px'}}>
                        <Grid xs={4}>
                            <Button variant="contained" sx={{height: '100px', width: '100px'}} onClick={() => {
                                quickCashButton(20)
                            }} size="large"><h2>$20</h2></Button>
                        </Grid>
                        <Grid xs={4}>
                            <Button variant="contained" sx={{height: '100px', width: '100px'}} onClick={() => {
                                quickCashButton(50)
                            }} size="large"><h2>$50</h2></Button>
                        </Grid>
                        <Grid xs={4}>
                            <Button variant="contained" sx={{height: '100px', width: '100px'}} onClick={() => {
                                quickCashButton(100)
                            }} size="large"><h2>$100</h2></Button>
                        </Grid>
                    </Grid>
                    <Grid xs={1}></Grid>
                </Grid>
                <ErrorDialog isVisible={errorOpen} title="Withdrawl error" setVisible={setErrorOpen} message={errMsg}/>
            </Box>
        </Box>);
}

WithDrawalScreen.propTypes = {
    accountData: PropTypes.object,
    nav: PropTypes.object
}

export default WithDrawalScreen;