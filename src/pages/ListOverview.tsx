import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
  List,
  ListItem,
  Card,
  Grid,
  Divider,
  ListItemText,
  ListItemIcon,
  IconButton,
  ListItemSecondaryAction
} from "@material-ui/core";
import React, { useEffect, useState, useCallback } from "react";
import InputField from "../components/InputField";
import { get, isSuccess, post } from "../services/fetchservice";
import IShoppingList from "./../models/IShoppingList";
import GetAppIcon from "@material-ui/icons/GetApp";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { useGlobalState, useGlobalStateReducer } from "../hooks/useGlobalState";
import ShoppingListView from "./ShoppingListView";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCont: {
      display: "flex",
      justifyContent: "space-between"
    },
    newListInput: {
      marginBottom: theme.spacing(2)
    },
    list: {
      marginTop: theme.spacing(3)
    },
    listPad: {
      padding: 0
    },
    card: {
      borderRadius: 0
    },
    title: {
      marginTop: "auto"
    }
  })
);

interface ICreateList {
  listName: string;
}

const ListOverview = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  const globalState = useGlobalState();
  const dispatchGlobalState = useGlobalStateReducer();

  const fetchAllLists = useCallback(async () => {
    const response = await get<IShoppingList[]>("ShoppingList/getAll", true);
    if (isSuccess(response)) {
      dispatchGlobalState({
        type: "setAllLists",
        lists: response as IShoppingList[]
      });
    }
  }, [dispatchGlobalState]);

  useEffect(() => {
    fetchAllLists();
  }, [fetchAllLists]);

  const createList = async () => {
    const response = await post<ICreateList, any>(
      "ShoppingList/create",
      { listName: newListName },
      true
    );
    setDialogIsOpen(false);
    setNewListName("");
    if (isSuccess(response)) {
      fetchAllLists();
    }
  };

  const listItemClicked = (list: IShoppingList) => () => {
    dispatchGlobalState({ type: "setShoppingList", selectedList: list });
  };

  const classes = useStyles();
  return (
    <div>
      {globalState.selectedList ? (
        <ShoppingListView />
      ) : (
        <>
          <div className={classes.titleCont}>
            <Typography variant="h6" className={classes.title}>
              Listenübersicht
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setDialogIsOpen(true)}
            >
              Liste erstellen
            </Button>
          </div>
          {globalState.lists.length > 0 && (
            <Grid container className={classes.list}>
              <Grid item xs={12} md={10} lg={8}>
                <Card className={classes.card}>
                  <List className={classes.listPad}>
                    {globalState.lists.map((list, index) => {
                      return (
                        <React.Fragment key={index}>
                          <ListItem button onClick={listItemClicked(list)}>
                            <ListItemText>{list.listname}</ListItemText>
                            <ListItemSecondaryAction>
                              {list.isFavourite ? (
                                <IconButton>
                                  <StarIcon />
                                </IconButton>
                              ) : (
                                <IconButton>
                                  <StarBorderIcon />
                                </IconButton>
                              )}
                              <IconButton>
                                <GetAppIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index === globalState.lists.length - 1 || (
                            <Divider />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Card>
              </Grid>
            </Grid>
          )}

          <Dialog open={dialogIsOpen} onClose={() => setDialogIsOpen(false)}>
            <DialogTitle>Liste erstellen</DialogTitle>
            <DialogContent>
              <InputField
                label="Listenname"
                onChange={value => setNewListName(value)}
                value={newListName}
                className={classes.newListInput}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDialogIsOpen(false)}
                color="secondary"
                variant="contained"
              >
                Abbrechen
              </Button>
              <Button onClick={createList} color="primary" variant="contained">
                Erstellen
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ListOverview;
