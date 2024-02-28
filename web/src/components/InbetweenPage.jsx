import {useEffect, useState} from 'react'
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import pages from '../globals';
import depositCash from '../assets/deposit.gif';
import withdrawalCash from '../assets/withdrawal.gif';

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
        <Grid container rowSpacing={1} columnSpacing={{xs: 1}}>
            <Grid xs={12} sx={{marginTop: '20px'}}>
                <h1>Dispensing Cash:</h1>
            </Grid>
            <Grid xs={12}>
                <img src={withdrawalCash}/>
            </Grid>
        </Grid>


    );
    inbetweenPages[pages.takecash] = (
        <Grid container rowSpacing={1} columnSpacing={{xs: 1}}>
            <Grid xs={12} sx={{marginTop: '20px'}}>
                <h1>Please Submit Deposit</h1>
            </Grid>
            <Grid xs={12}>
                <img style={{height: '300px'}} src={depositCash}/>
            </Grid>
        </Grid>
    );

    return (
        <Box name="nothing" sx={{
            bgcolor: '#cfe8fc',
            width: '700px',
            height: '500px',
            border: '1px solid green',
            alignItems: "center"
        }}>
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