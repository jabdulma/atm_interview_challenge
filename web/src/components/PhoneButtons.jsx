import {useEffect, useState} from 'react'

import {Button} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {Backspace} from '@mui/icons-material';
import PropTypes from 'prop-types';
import {cleanCashNumber} from "../globals";

const PhoneButtons = ({inVal, setAmount}) => {
    //withdrawl state

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
    }, []);

    function handlePhoneButtonPush(num, currVal, changeFunc) {
        let newVal = currVal.toString();
        if (num === "del") {
            newVal = cleanCashNumber(newVal.slice(0, -1));
        } else if (num === "x") {
            newVal = cleanCashNumber("0");
        } else {
            newVal = cleanCashNumber(newVal + num.toString());
        }
        changeFunc(newVal);
    }

    function phoneButtons(val, changeFunc) {
        let buttons = [];
        let i = 0;
        for (i = 1; i < 10; i++) {
            let number = i;
            buttons.push(
                <Grid key={"phonekeysButton" + number} xs={4}>
                    <Button variant="contained" size="large" onClick={() => {
                        handlePhoneButtonPush(number, val, changeFunc)
                    }}>{number}</Button>
                </Grid>
            )
        }
        //Handle last row of keys outside loop because of special cases
        buttons.push(<Grid key={"phonekeysButtonX"} xs={4}><Button variant="contained" size="large" onClick={() => {
            handlePhoneButtonPush("x", val, changeFunc)
        }}>X</Button></Grid>)
        buttons.push(<Grid key={"phonekeysButton0"} xs={4}><Button variant="contained" size="large" onClick={() => {
            handlePhoneButtonPush(0, val, changeFunc)
        }}>0</Button></Grid>)
        buttons.push(<Grid key={"phonekeysButtonD"} xs={4}><Button variant="contained" size="large" onClick={() => {
            handlePhoneButtonPush("del", val, changeFunc)
        }}><Backspace/></Button></Grid>)
        return buttons;
    }


    return (
        <>
            {phoneButtons(inVal, setAmount)}
        </>)
}

PhoneButtons.propTypes = {
    inVal: PropTypes.string,
    setAmount: PropTypes.func
}

export default PhoneButtons;