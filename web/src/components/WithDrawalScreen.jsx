import {useEffect, useState} from 'react'

import {Button, InputAdornment, Paper, TextField} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {Backspace}  from '@mui/icons-material';
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import PropTypes from 'prop-types';
import pages from '../globals';
import ErrorDialog from "./ErrorDialog.jsx";

const WithDrawalScreen = ({nav}) => {
    //withdrawl state
    const [widthdrawalAmount, setWD] = useState("0");
    const [errorOpen, setErrorOpen] = useState(false);
    const [errMsg, setErrMsg] = useState("")

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        nav.setTitle("Withdrawal Funds")
        setWD(0)
    }, []);

    function handlePhoneButtonPush(num, currVal, changeFunc){
        let newVal = currVal.toString();

        if(num === "del"){
            newVal = cleanCashNumber(newVal.slice(0, -1));
        } else if (num === "x"){
            newVal = cleanCashNumber("");
        } else {
            newVal =  cleanCashNumber(newVal + num.toString());
        }
        changeFunc(newVal);
    }

    function phoneButtons(val, changeFunc){
        let buttons = [];
        let i = 0;
        for(i=1;i<10;i++){
            let number = i;
            buttons.push(
                <Grid key={"phonekeysButton" + number} xs={4}>
                    <Button variant="contained" size="large" onClick={() => {handlePhoneButtonPush(number, val, changeFunc)}} >{number}</Button>
                </Grid>
            )
        }
        //Handle last row of keys outside loop because of special cases
        buttons.push(<Grid key={"phonekeysButtonX"} xs={4}><Button variant="contained" size="large" onClick={() => {handlePhoneButtonPush("X", val, changeFunc)}}>X</Button></Grid>) //Having a do-nothing button is bad UI,
        buttons.push(<Grid key={"phonekeysButton0"} xs={4}><Button variant="contained" size="large" onClick={() => {handlePhoneButtonPush(0, val, changeFunc)}}>0</Button></Grid>)
        buttons.push(<Grid key={"phonekeysButtonD"} xs={4}><Button variant="contained" size="large"onClick={() => {handlePhoneButtonPush("del", val, changeFunc)}}><Backspace /></Button></Grid>)
        return buttons;
    }

    function cleanCashNumber(val){
        //Remove alphabet characters
        val = val.replace(/[a-zA-Z]/g, '')
        //Set empty string to 0
        val = val.length === 0 ? "0" : val;
        //Remove leading zeroes by converting to int
        val = parseInt(val, 10);
        val = val.toString();
        return val;
    }

    function handleWithdrawalChange(e){
        //Normally values are intercepted at keypress, but by using a "cleaning" function
        //we get to keep things like select all and delete key combinations easily.
        let wamount = e.target.value;
        setWD(cleanCashNumber(wamount))
    }

    function getCash(){
        //Local Error Handling
        if(widthdrawalAmount % 5 > 0){
            setErrMsg("Please enter a value divisible by 5");
            setErrorOpen(true);
            return;
        } else if (widthdrawalAmount > 200){
            setErrMsg("Withdrawls cannot exceed 200 in a single transaction.");
            setErrorOpen(true);
            return;
        }
        //
        nav.setPage(pages.givecash);
    }

    function cancelOut(){
        nav.setPage(pages.mainmenu);
    }

    return (
    <Box name="withdrawal" sx={{ bgcolor: '#cfe8fc', width: '700px', height: '500px', border: '1px solid green', alignItems: "center" }}>
        <Box sx={{ paddingTop: '50px', flexGrow: 1 }}>Please enter a withdrawl amount in multiples of 5, or select a quick cash option below: </Box>
        <Box   display="flex"
               justifyContent="center"
               alignItems="center" sx={{paddingTop: '50px'}}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                <Grid xs={1}></Grid>
                <Grid container  xs={4} rowSpacing={1} columnSpacing={{ xs: 0}}>
                    {phoneButtons(widthdrawalAmount, setWD)}
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
                                       value={widthdrawalAmount}
                                       onChange={handleWithdrawalChange}
                                       variant="filled"
                                       label="Withdrawal Amount" />
                        </Paper>
                        <Button sx={{marginTop:'20px'}} onClick={getCash} variant="contained" size="large">Get Cash</Button>
                        <Button sx={{marginTop:'20px'}} onClick={cancelOut} variant="contained" size="large">Cancel</Button>
                    </Stack>

                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={1}></Grid>
                <Grid xs={10} container sx={{paddingTop: '40px'}}>
                    <Grid xs={4}>
                        <Button variant="contained" sx={{height: '100px', width:'100px'}} size="large"><h2>$20</h2></Button>
                    </Grid>
                    <Grid xs={4}>
                        <Button variant="contained" sx={{height: '100px', width:'100px'}} size="large"><h2>$50</h2></Button>
                    </Grid>
                    <Grid xs={4}>
                        <Button variant="contained" sx={{height: '100px', width:'100px'}} size="large"><h2>$100</h2></Button>
                    </Grid>
                </Grid>
                <Grid xs={1}></Grid>
            </Grid>
            <ErrorDialog isVisible={errorOpen} title="Withdrawl error" setVisible={setErrorOpen} message={errMsg} />
        </Box>
    </Box>);
}

WithDrawalScreen.propTypes = {
    nav: PropTypes.object
}

export default WithDrawalScreen;