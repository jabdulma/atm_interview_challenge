import {useEffect, useState} from 'react'

import {AppBar, Button, Paper, TextField, Toolbar, Tooltip, Typography} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {Backspace}  from '@mui/icons-material';
import App from "../App.jsx";
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";

function WithDrawalScreen() {
    //withdrawl state
    const [widthdrawlAmount, setWD] = useState("");

    function phoneButtons(){
        var buttons = [];
        for(var i=1;i<10;i++){
            buttons.push(
                <Grid xs={4}>
                    <Button variant="contained" size="large">{i}</Button>
                </Grid>
            )
        }
        //Handle last row of keys outside loop because of special cases
        buttons.push(<Grid xs={4}><Button variant="contained" size="large">B</Button></Grid>) //Having a do-nothing button is bad UI,
        buttons.push(<Grid xs={4}><Button variant="contained" size="large">0</Button></Grid>)
        buttons.push(<Grid xs={4}><Button variant="contained" size="large"><Backspace /></Button></Grid>)
        return buttons;
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        setWD(0)
    }, []);

    return (
    <Box name="withdrawl" sx={{ bgcolor: '#cfe8fc', width: '700px', height: '500px', border: '1px solid green', alignItems: "center" }}>
        <Box sx={{ paddingTop: '50px', flexGrow: 1 }}>Please enter a withdrawl amount in multiples of 5, or select a quick cash option below: </Box>
        <Box   display="flex"
               justifyContent="center"
               alignItems="center" sx={{paddingTop: '50px'}}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
                <Grid xs={1}></Grid>
                <Grid container  xs={4} rowSpacing={1} columnSpacing={{ xs: 0}}>
                    {phoneButtons()}
                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={5}>
                    <Stack>
                        <Paper sx={{width: '100%'}}>
                            <TextField fullWidth value={widthdrawlAmount} onChange={() => {}} variant="filled" label="Withdrawal Amount" />
                        </Paper>
                        <Button sx={{marginTop:'20px'}} variant="contained" size="large">Get Cash</Button>
                        <Button sx={{marginTop:'20px'}} variant="contained" size="large">Cancel</Button>
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
        </Box>
    </Box>);
}

export default WithDrawalScreen;