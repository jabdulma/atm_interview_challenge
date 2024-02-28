import {useEffect, useState} from 'react'
import './App.css'

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {AppBar, Button, Paper, TextField, Toolbar, Tooltip, Typography} from "@mui/material";


import pages from './globals';
import WithDrawalScreen from './components/WithDrawalScreen'
import InbetweenPage from "./components/InbetweenPage.jsx";
import DepositScreen from "./components/DepositScreen.jsx";

//Main Menu Imports & consts
import {PriceCheck, DoubleArrow, LocalAtm, RequestQuote, Money, Logout}  from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import ErrorDialog from "./components/ErrorDialog.jsx";


const menuItemSx = {flexGrow: 1, justifyContent:'space-between', backgroundColor: "#44AA44", minHeight: '63px', maxHeight: '65px', margin:'0px', marginLeft:'10px'};

//Example data, replace with DB / API connection
const exampleStr = `[{"accountNo":1,"accountName":"Johns Checking","amount":1000,"type":"checking"},{"accountNo":2,"accountName":"Janes Savings","amount":2000,"type":"savings"},{"accountNo":3,"accountName":"Jills Credit","amount":-3000,"type":"credit"},{"accountNo":4,"accountName":"Bobs Checking","amount":40000,"type":"checking"},{"accountNo":5,"accountName":"Bills Savings","amount":50000,"type":"savings"},{"accountNo":6,"accountName":"Bills Credit","amount":-60000,"type":"credit"},{"accountNo":7,"accountName":"Nancy Checking","amount":70000,"type":"checking"},{"accountNo":8,"accountName":"Nancy Savings","amount":80000,"type":"savings"},{"accountNo":9,"accountName":"Nancy Credit","amount":-90000,"type":"credit"}]`
let exampleData = JSON.parse(exampleStr);

function App() {
  //const [count, setCount] = useState(0)
  const [title, setTitle] = useState("")
  const [currPage, setCurrPage] = useState("loginScreen")
  const [account, setAccount] = useState("")
  const [accountData, setAccountData] = useState({})
  const [errorOpen, setErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("")

    const navigator = {
      setPage: setCurrPage,
      setTitle: setTitle,
      updateAccount: getAccount
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
    }, []);

    //Control the title depending on the current page
    useEffect(() => {
        switch (currPage){
            case pages.mainmenu:
                setTitle(accountData.name)
                break;
            case pages.deposit:
                setTitle("Make a Deposit")
                break;
            case pages.withdrawal:
                setTitle("Make a Withdrawal")
                break;
            case pages.balance:
                setTitle("Balance")
                break;
            case pages.givecash:
            case pages.takecash:
                setTitle("$ $ $")
                break;
            case pages.login:
            default:
                setTitle("Welcome to this Bank ATM")
        }
    }, [currPage]);

  function handleAccountNumChange(e){
      setAccount(e.target.value)
  }

  function getAccount(setPage){
      axios.post("/api/getAccount", {
          accountNum: account
      }).then((res) => {
          setAccountData(res.data[0])
          setTitle(res.data[0]['name'])
          if(setPage){
              setCurrPage(setPage)
          }
      }).catch((error) => {
          setErrMsg("error: " + response.data.error);
          setErrorOpen(true);
      })
  }

  function login(){
      if(account.trim() === ""){
        setErrMsg("Please enter an account number");
        setErrorOpen(true);
      } else {
          getAccount(pages.mainmenu)
      }
  }

    function logoff(){
        setAccount("")
        setAccountData({})
        setCurrPage(pages.login)
    }

  return (
    <>
        <CssBaseline />
        <Container maxWidth="md" style={{}}>
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
                    'withdrawal': <WithDrawalScreen accountData={accountData} nav={navigator} setPage={setCurrPage} setTitle={setTitle} />,
                    'deposit': <DepositScreen accountData={accountData} nav={navigator} setPage={setCurrPage} setTitle={setTitle} />,
                    'checkBalance': <Box key="balance" name="balance" sx={{ bgcolor: '#cfe8fc', width: '700px', height: '500px', alignItems: "center" }}>
                        <Box sx={{ paddingTop: '50px', flexGrow: 1 }}>Your current balance is:</Box>
                        <h1>${accountData.amount}</h1>
                        <Button onClick={() => {setCurrPage(pages.mainmenu)}} variant="contained" size="large" >Back</Button>
                    </Box>,
                    'mainMenu':
                        <Box key="mainMenu" name="mainMenu" sx={{ bgcolor: '#cfe8fc', width: '700px', height: '500px', alignItems: "center" }}>
                            <Box sx={{ paddingTop: '50px', flexGrow: 1 }}>Please select an option below:</Box>
                            <Box   display="flex"
                                   justifyContent="center"
                                   alignItems="center" sx={{paddingTop: '50px'}}>
                                    <Stack spacing={2}>
                                        <Button onClick={() => {setCurrPage(pages.withdrawal)}} variant="contained" size="large" sx={menuItemSx} ><Money fontSize="large" sx={{marginRight: "10px"}}/> Make a WithDrawl <DoubleArrow fontSize="large" sx={{marginLeft: "10px"}}/></Button>
                                        <Button onClick={() => {setCurrPage(pages.deposit)}} variant="contained" size="large" sx={menuItemSx} ><LocalAtm fontSize="large" sx={{marginRight: "10px"}}/> Make a Deposit <DoubleArrow fontSize="large" sx={{marginLeft: "10px"}}/></Button>
                                        <Button onClick={() => {setCurrPage(pages.balance)}} variant="contained" size="large" sx={menuItemSx} ><RequestQuote fontSize="large" sx={{marginRight: "10px"}}/> Check Balance <DoubleArrow fontSize="large" sx={{marginLeft: "10px"}}/></Button>
                                        <Button onClick={logoff} variant="contained" size="large" sx={menuItemSx} > Log out<Logout fontSize="large" sx={{marginLeft: "10px"}}/></Button>
                                    </Stack>
                            </Box>
                        </Box>,
                    'loginScreen':
                        <Box key="loginScreen" name="loginScreen" sx={{bgcolor: '#cfe8fc', width: '700px', height: '500px', alignItems: "center" }}>
                            <Box sx={{ paddingTop: '50px', flexGrow: 1 }}>To sign in, please enter your account number:</Box>
                            <Box   display="flex"
                                   justifyContent="center"
                                   alignItems="center" sx={{ paddingTop: '50px', flexGrow: 1}}>
                                <Paper sx={{width: '400px', maxWidth:'600px'}}>
                                    <TextField fullWidth sx={{width: '400px'}} value={account} onChange={handleAccountNumChange} variant="filled" label="Account Number" />
                                </Paper>
                                <Button variant="contained" size="small" onClick={login} sx={{minHeight: '63px', maxHeight: '65px', margin:'0px', marginLeft:'10px'}} >Login</Button>
                            </Box>
                            <ErrorDialog isVisible={errorOpen} title="Login Error" setVisible={setErrorOpen} message={errMsg} />
                        </Box>,
                    'inbetweenWithdrawal': <InbetweenPage nav={navigator} pageType={pages.givecash} timer={3500} destination={pages.mainmenu}></InbetweenPage>,
                    'inbetweenDeposit': <InbetweenPage nav={navigator} pageType={pages.takecash} timer={3500} destination={pages.mainmenu}></InbetweenPage>
                }[currPage]
            }
        </Container>
    </>
  )
}

export default App
