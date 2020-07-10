import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import login from './pages/login';
import signup from './pages/signup';
import home from './pages/home';
import NavBar from './components/NavBar';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import './assets/css/fonts.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#cce3de',
      main: '#deaaff',
      dark: '#283d3b',
      contrastText: '#fff'
    }
  },
  typography: {
    fontFamily: "PT Sans",
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <NavBar />  
        <div>
          <Switch>
            <Route exact path="/" component={home}></Route>
            <Route exact path="/login" component={login}></Route>
            <Route exact path="/signup" component={signup}></Route>
          </Switch>
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
