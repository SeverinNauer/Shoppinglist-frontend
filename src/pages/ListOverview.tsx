import {
  Button,
  Card,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import React, { useCallback, useEffect, useState } from "react";
import InputField from "../components/InputField";
import { useGlobalState, useGlobalStateReducer } from "../hooks/useGlobalState";
import IShoppingList from "./../models/IShoppingList";
import ShoppingListView from "./ShoppingListView";
import useFetch from "./../services/fetchservice";

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
      marginTop: theme.spacing(3),
      height: "calc(100vh - 200px)",
      overflowY: "auto"
    },
    listPad: {
      padding: 0
    },
    card: {
      borderRadius: 0,
    },
    title: {
      marginTop: "auto"
    },
    listItemInput: {
      paddingRight: theme.spacing(20)
    },
    input: {
      padding: "14px 12px"
    }
  })
);

interface ICreateList {
  listName: string;
}

export interface IChangeIsFavourite {
  listId: number;
  isFavourite: boolean;
}

interface IDeleteList {}

const ListOverview = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  const globalState = useGlobalState();
  const dispatchGlobalState = useGlobalStateReducer();
  const [get, post, put, getFile, isSuccess] = useFetch();

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

  const setListIsFavourite = (
    listId: number,
    isFavourite: boolean
  ) => async () => {
    const response = await put<IChangeIsFavourite, IShoppingList>(
      "ShoppingList/changeListIsFavourite",
      { listId, isFavourite },
      true
    );
    if (isSuccess(response)) {
      fetchAllLists();
    }
  };

  const deleteList = (listId: number) => async () => {
    const response = await post<IDeleteList, IShoppingList>(
      "ShoppingList/delete",
      { listId },
      true
    );
    if (isSuccess(response)) {
      fetchAllLists();
    }
  };

  const listItemClicked = (list: IShoppingList) => async () => {
    const response = await get<IShoppingList>(
      "ShoppingList/get?listId=" + list.id,
      true
    );

    if (isSuccess(response)) {
      dispatchGlobalState({
        type: "setShoppingList",
        selectedList: response as IShoppingList
      });
    }
  };

  const downloadFile = (list: IShoppingList) => async () => {
    await getFile(
      "ShoppingList/getAsFile?listId=" + list.id,
      list.listname + ".txt"
    );
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
                              <IconButton onClick={deleteList(list.id)}>
                                <DeleteIcon />
                              </IconButton>
                              {list.isFavourite ? (
                                <IconButton
                                  onClick={setListIsFavourite(list.id, false)}
                                >
                                  <StarIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={setListIsFavourite(list.id, true)}
                                >
                                  <StarBorderIcon />
                                </IconButton>
                              )}
                              <IconButton onClick={downloadFile(list)}>
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
