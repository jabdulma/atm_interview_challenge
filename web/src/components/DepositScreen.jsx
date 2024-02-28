import {useEffect, useState} from 'react'

import {Button, InputAdornment, Paper, TextField} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import PropTypes from 'prop-types';

import pages from "../globals";
import {cleanCashNumber} from "../globals";
import PhoneButtons from "./PhoneButtons.jsx";
import ErrorDialog from "./ErrorDialog.jsx";
import axios from "axios";

const DepositScreen = ({accountData, nav}) => {
    //withdrawl state
    const [depositAmount, setDA] = useState("0");
    const [balance, setBalance] = useState("1000");
    const [accountType, setAT] = useState("0");
    const [errorOpen, setErrorOpen] = useState(false);
    const [errMsg, setErrMsg] = useState("")

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        nav.setTitle("Deposit Cash")
        setDA(0)
    }, []);


    function handleDepositChange(e){
        //Normally values are intercepted at keypress, but by using a "cleaning" function
        //we get to keep things like select all and delete key combinations easily.
        let damount = e.target.value;
        setDA(cleanCashNumber(damount))
    }

    function takeCash(){
        if(depositAmount > 1000){
            setErrMsg("Deposits cannot exceed 1000 in a single transaction.");
            setErrorOpen(true);
            return;
        }
        axios.post("/api/makeDeposit", {
            account: accountData.account_number,
            amount: depositAmount
        }).then((res) => {
            nav.setPage(pages.takecash);
            nav.updateAccount();
        }).catch((error) => {
            setErrMsg("There was an error, please try again. " + error.response?.data?.error);
            setErrorOpen(true);
        })
    }

    function cancelOut(){
        nav.setPage(pages.mainmenu);
    }

    return (
    <Box name="deposit" sx={{ bgcolor: '#cfe8fc', width: '700px', height: '500px', alignItems: "center" }}>
        <Box sx={{ paddingTop: '50px', flexGrow: 1 }}>Please Enter a Deposit Amount: </Box>
        <Box   display="flex"
               justifyContent="center"
               alignItems="center" sx={{paddingTop: '50px'}}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                <Grid xs={1}></Grid>
                <Grid container  xs={4} rowSpacing={1} columnSpacing={{ xs: 0}}>
                    <PhoneButtons inVal={depositAmount} setAmount={setDA} />
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
                                       value={depositAmount}
                                       onChange={handleDepositChange}
                                       variant="filled"
                                       label="Withdrawal Amount" />
                        </Paper>
                        <Button sx={{marginTop:'20px'}} onClick={takeCash} variant="contained" size="large">Deposit Cash</Button>
                        <Button sx={{marginTop:'20px'}} onClick={cancelOut} variant="contained" size="large">Cancel</Button>
                    </Stack>

                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={1}></Grid>
                <Grid xs={10} container sx={{paddingTop: '40px'}}>
                </Grid>
                <Grid xs={1}></Grid>
            </Grid>
        </Box>
        <ErrorDialog isVisible={errorOpen} title="Withdrawl error" setVisible={setErrorOpen} message={errMsg} />
    </Box>);
}

DepositScreen.propTypes = {
    accountData: PropTypes.object,
    nav: PropTypes.object
}

export default DepositScreen;