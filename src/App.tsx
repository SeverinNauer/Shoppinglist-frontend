import React from "react";
import {
  makeStyles,
  createStyles,
  Theme
} from "../node_modules/@material-ui/core/styles";
import {
  AuthenticationProvider,
  AuthenticationReducer
} from "./hooks/useAuthentication";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      backgroundColor: theme.palette.primary.main
    }
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <BrowserRouter>
        <AuthenticationProvider
          initialState={undefined}
          reducer={AuthenticationReducer}
        >
          <Switch>
            <Route exact path="/">
              <MainPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/signup">
              <SignUpPage />
            </Route>
          </Switch>
        </AuthenticationProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
