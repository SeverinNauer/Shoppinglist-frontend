import {
  Button,
  Card,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import InputField from "../components/InputField";
import {
  useAuthentication,
  useAuthenticationReducer
} from "./../hooks/useAuthentication";
import useFetch from "../services/fetchservice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      textAlign: "center",
      display: "grid",
      gridTemplateRows: "1fr auto 1fr"
    },
    card: {
      textAlign: "left",
      padding: 20,
      margin: 10,
      backgroundColor: theme.palette.secondary.main
    },
    fields: {
      display: "flex",
      flexDirection: "column",
      marginTop: 10
    },
    classNameField: {
      marginTop: 10
    },
    title: {
      marginTop: "auto",
      marginBottom: 20
    },
    loginButton: {
      float: "right"
    },
    action: {
      marginTop: 10,
      display: "flex",
      justifyContent: "space-between"
    },
    link: {
      marginTop: "auto",
      marginBottom: "auto",
      color: "#0D47A1"
    }
  })
);

interface IloginData {
  Username: string;
  Password: string;
}

const LoginPage = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const authentication = useAuthentication();
  const dispatch = useAuthenticationReducer();
  const [, post, , , isSuccess] = useFetch();

  const onLinkClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    history.push("/signup");
  };

  const login = async () => {
    const data: IloginData = { Username: username, Password: password };
    const response = await post<IloginData, string>("Account/login", data);
    if (isSuccess(response)) {
      dispatch({ token: response, type: "setToken" });
    }
  };

  useEffect(() => {
    if (authentication.jwttoken) {
      history.push("/");
    }
  }, [authentication, history]);

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Einkaufsliste
      </Typography>
      <Grid container justify={"space-around"}>
        <Grid item xs={12} md={6} lg={4}>
          <Card className={classes.card} color="secondary">
            <Typography variant="h6">Anmelden</Typography>
            <div className={classes.fields}>
              <InputField
                value={username}
                label="Email"
                onChange={value => setUsername(value)}
              />
              <InputField
                className={classes.classNameField}
                value={password}
                label="Passwort"
                onChange={value => setPassword(value)}
                type="password"
              />
            </div>
            <div className={classes.action}>
              <Link href="" onClick={onLinkClick} className={classes.link}>
                Account erstellen
              </Link>
              <Button
                variant="contained"
                color="primary"
                className={classes.loginButton}
                onClick={login}
              >
                Einloggen
              </Button>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
