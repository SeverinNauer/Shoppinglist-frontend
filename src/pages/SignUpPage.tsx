import { Button, Card, createStyles, Grid, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import InputField from "../components/InputField";
import { isSuccess, post } from "../services/fetchservice";
import { useAuthentication } from "./../hooks/useAuthentication";

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

interface ISignupData {
  Username: string;
  Password: string;
}

const SignUpPage = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const history = useHistory();
  const authentication = useAuthentication();

  const onLinkClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    history.push("/login");
  };

  const signup = async () => {
    if (password !== password2) {
      return;
    }
    const data: ISignupData = { Username: username, Password: password };
    const response = await post<ISignupData, any>("Account/create", data);
    if (isSuccess(response)) {
      history.push("/login");
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
                label="Benutzername"
                onChange={value => setUsername(value)}
              />
              <InputField
                className={classes.classNameField}
                value={password}
                label="Passwort"
                onChange={value => setPassword(value)}
                type="password"
              />
              <InputField
                className={classes.classNameField}
                value={password2}
                label="Passwort bestätigen"
                onChange={value => setPassword2(value)}
                type="password"
              />
            </div>
            <div className={classes.action}>
              <Link href="" onClick={onLinkClick} className={classes.link}>
                zum Login
              </Link>
              <Button
                variant="contained"
                color="primary"
                className={classes.loginButton}
                onClick={signup}
              >
                Registrieren
              </Button>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignUpPage;
