import {useEffect, useState} from 'react'
import {Button, InputAdornment, Paper, TextField} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {Backspace}  from '@mui/icons-material';
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import PropTypes from 'prop-types';
import pages from '../globals';

const InbetweenPage = ({nav, pageType, timer = 2000, destination}) => {
    //withdrawl state
    //const [widthdrawalAmount, setWD] = useState("0");

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        nav.setTitle("")
        const timerId = setTimeout(() => {
            nav.setPage(destination)
        }, timer);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timerId);
    }, []);

    const inbetweenPages = {};
    inbetweenPages[pages.givecash] = (
        <h6>Test</h6>
    );

    return (
        <Box name="nothing" sx={{ bgcolor: '#cfe8fc', width: '700px', height: '500px', border: '1px solid green', alignItems: "center" }}>
            Test
            {inbetweenPages[pageType]}
        </Box>);
}

InbetweenPage.propTypes = {
    nav: PropTypes.object,
    pageType: PropTypes.string,
    timer: PropTypes.number,
    destination: PropTypes.string
}

export default InbetweenPage;