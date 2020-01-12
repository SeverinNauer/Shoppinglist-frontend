import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#C9F1FD'
      },
      secondary: {
        main: '#EBEBEB'
      }
    },
    overrides:{
        MuiInput:{
            underline:{
                "&:after":{
                    borderBottomColor: "rgba(0, 0, 0, 0.87)"
                }
            }
        }
    }
  });

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
