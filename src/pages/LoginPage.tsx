import React, { useState } from "react";
import {
  makeStyles,
  createStyles,
  Theme,
  Typography,
  Card,
  Button,
  Link
} from "@material-ui/core";
import InputField from "../components/InputField";
import { useHistory } from "react-router-dom";

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

const LoginPage = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const onLinkClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    history.push("/signup");
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Einkaufsliste
      </Typography>
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
          >
            Einloggen
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
