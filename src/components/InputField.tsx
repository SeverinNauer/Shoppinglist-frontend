import React from "react";
import { TextField, makeStyles, Theme, createStyles } from "@material-ui/core";

interface IProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    darkColor: {
      color: theme.palette.getContrastText(theme.palette.secondary.main) + "!important",
    }
  })
);

const InputField = (props: IProps) => {
  const classes = useStyles();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    props.onChange(value);
  };

  return (
    <TextField
      className={props.className}
      label={props.label}
      InputLabelProps={{
        classes: {
          focused: classes.darkColor,
        }
      }}
      InputProps={{
          classes:{underline: classes.darkColor }
      }}
      value={props.value}
      onChange={onChange}
    />
  );
};

export default InputField;
