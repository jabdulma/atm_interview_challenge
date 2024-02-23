import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {AppBar, Button, Paper, TextField, Toolbar, Tooltip, Typography} from "@mui/material";
//import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import WithDrawalScreen from './components/WithDrawalScreen'

//Main Menu Imports & consts
import {PriceCheck, DoubleArrow, LocalAtm, RequestQuote, Money}  from '@mui/icons-material';
import Stack from '@mui/material/Stack';
const menuItemSx = {flexGrow: 1, justifyContent:'space-between', backgroundColor: "#44AA44", minHeight: '63px', maxHeight: '65px', margin:'0px', marginLeft:'10px'};

//Withdrawl
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {Backspace}  from '@mui/icons-material';

//Example data, replace with DB / API connection

const exampleStr = `[{"accountNo":1,"accountName":"Johns Checking","amount":1000,"type":"checking"},{"accountNo":2,"accountName":"Janes Savings","amount":2000,"type":"savings"},{"accountNo":3,"accountName":"Jills Credit","amount":-3000,"type":"credit"},{"accountNo":4,"accountName":"Bobs Checking","amount":40000,"type":"checking"},{"accountNo":5,"accountName":"Bills Savings","amount":50000,"type":"savings"},{"accountNo":6,"accountName":"Bills Credit","amount":-60000,"type":"credit"},{"accountNo":7,"accountName":"Nancy Checking","amount":70000,"type":"checking"},{"accountNo":8,"accountName":"Nancy Savings","amount":80000,"type":"savings"},{"accountNo":9,"accountName":"Nancy Credit","amount":-90000,"type":"credit"}]`
let exampleData = JSON.parse(exampleStr);

const titleMessage = "Welcome to this JohnBank ATM"

function App() {
  //const [count, setCount] = useState(0)
  const [title, setTitle] = useState("")
  const [currPage, setCurrPage] = useState("withdrawal")




    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        setTitle(titleMessage)
    }, []);


  return (
    <>
        <CssBaseline />
        <Container maxWidth="md" style={{border: '1px solid red'}}>
            <Box sx={{ flexGrow: 1}} >
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' }}}
                        >{title}</Typography>
                    </Toolbar>
                </AppBar>
            </Box>

            {
                {
                    'withdrawal': <WithDrawalScreen />,
                    'mainMenu':
                        <Box name="mainMenu" sx={{ bgcolor: '#cfe8fc', width: '700px', height: '500px', border: '1px solid green', alignItems: "center" }}>
                            <Box sx={{ paddingTop: '50px', flexGrow: 1 }}>Please select an option below:</Box>
                            <Box   display="flex"
                                   justifyContent="center"
                                   alignItems="center" sx={{paddingTop: '50px'}}>
                                    <Stack spacing={2}>
                                        <Button  variant="contained" size="large" sx={menuItemSx} ><Money fontSize="large" sx={{marginRight: "10px"}}/> Make a WithDrawl <DoubleArrow fontSize="large" sx={{marginLeft: "10px"}}/></Button>
                                        <Button  variant="contained" size="large" sx={menuItemSx} ><LocalAtm fontSize="large" sx={{marginRight: "10px"}}/> Make a Deposit <DoubleArrow fontSize="large" sx={{marginLeft: "10px"}}/></Button>
                                        <Button  variant="contained" size="large" sx={menuItemSx} ><RequestQuote fontSize="large" sx={{marginRight: "10px"}}/> Check Balance <DoubleArrow fontSize="large" sx={{marginLeft: "10px"}}/></Button>
                                    </Stack>
                            </Box>
                        </Box>,
                    'loginScreen':
                        <Box name="loginScreen" sx={{ display: 'none', bgcolor: '#cfe8fc', width: '700px', height: '500px', border: '1px solid green', alignItems: "center" }}>
                            <Box sx={{ paddingTop: '50px', flexGrow: 1 }}>To sign in, please enter your account number:</Box>
                            <Box   display="flex"
                                   justifyContent="center"
                                   alignItems="center" sx={{ paddingTop: '50px', flexGrow: 1}}>
                                <Paper sx={{width: '400px', maxWidth:'600px'}}>
                                    <TextField fullWidth sx={{width: '400px'}} value={null} onChange={() => {}} variant="filled" label="Account Number" />
                                </Paper>
                                <Button variant="contained" size="small" sx={{minHeight: '63px', maxHeight: '65px', margin:'0px', marginLeft:'10px'}} >Login</Button>
                            </Box>
                        </Box>
                }[currPage]
            }
        </Container>
    </>
  )
}

export default App
