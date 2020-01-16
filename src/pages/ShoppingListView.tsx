import { Card, createStyles, Divider, Fab, Grid, IconButton, List, ListItem, ListItemText, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from "@material-ui/icons/GetApp";
import React, { useState } from "react";
import { useGlobalState, useGlobalStateReducer } from "../hooks/useGlobalState";
import IListItem from "../models/IListItem";
import IShoppingList from "../models/IShoppingList";
import { getFile, isSuccess, post, put } from "../services/fetchservice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCont: {
      display: "flex",
      justifyContent: "space-between"
    },
    title: {
      marginTop: "auto",
      marginBottom: "auto"
    },
    list: {
      marginTop: theme.spacing(3)
    },
    card: {
      borderRadius: 0,
      overflowY: "auto"
    },
    listPad: {
      padding: 0
    },
    input: {
      padding: "14px 12px"
    },
    itemIsChecked: {
      textDecoration: "line-through"
    },
    listItemInput: {
      paddingRight: theme.spacing(10)
    }
  })
);

interface IAddItem {
  listId: number;
  itemname: string;
}
interface IDeleteItem {
  listId: number;
  itemId: number;
}

interface IChangeItemName {
  listId: number;
  itemId: number;
  itemname: string;
}

interface IChangeItemChecked {
  listId: number;
  itemId: number;
  isChecked: boolean;
}

const ShoppingListView = () => {
  const globalState = useGlobalState();
  const globalStateDispatch = useGlobalStateReducer();
  const classes = useStyles();
  const [newItem, setNewItem] = useState("");
  const [editedItem, setEditedItem] = useState("");
  const [editItemId, setEditItemId] = useState(-1);
  const selectedList = globalState.selectedList;

  const onItemCheck = (item: IListItem) => async () => {
    const data: IChangeItemChecked = {
      listId: selectedList!.id,
      itemId: item.id,
      isChecked: !item.isChecked
    };
    const response = await put<IDeleteItem, IShoppingList>(
      "ShoppingList/changeItemIsChecked",
      data,
      true
    );
    if (isSuccess(response)) {
      globalStateDispatch({
        type: "setShoppingList",
        selectedList: response as IShoppingList
      });
    }
  };

  const onEditModeItem = (item: IListItem) => () => {
    if (item.id === editItemId) {
      setEditItemId(-1);
      setEditedItem("");
      return;
    }
    setEditItemId(item.id);
    setEditedItem(item.itemname);
  };

  const onDeleteItem = (item: IListItem) => async () => {
    const data: IDeleteItem = { listId: selectedList!.id, itemId: item.id };
    const response = await post<IDeleteItem, IShoppingList>(
      "ShoppingList/deleteItem",
      data,
      true
    );
    if (isSuccess(response)) {
      globalStateDispatch({
        type: "setShoppingList",
        selectedList: response as IShoppingList
      });
    }
  };

  const addNew = async () => {
    const data: IAddItem = { listId: selectedList!.id, itemname: newItem };
    const response = await post<IAddItem, IShoppingList>(
      "ShoppingList/addItem",
      data,
      true
    );
    if (isSuccess(response)) {
      globalStateDispatch({
        type: "setShoppingList",
        selectedList: response as IShoppingList
      });
      setNewItem("");
    }
  };

  const changeItemName = async () => {
    const data: IChangeItemName = {
      listId: selectedList!.id,
      itemId: editItemId,
      itemname: editedItem
    };
    const response = await put<IDeleteItem, IShoppingList>(
      "ShoppingList/changeItemName",
      data,
      true
    );
    if (isSuccess(response)) {
      globalStateDispatch({
        type: "setShoppingList",
        selectedList: response as IShoppingList
      });
      setEditItemId(-1);
      setEditedItem("");
    }
  };

  const onKeyDown = (isNew = true) => (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.keyCode === 13) {
      if (isNew && newItem) {
        addNew();
      } else if (editedItem) {
        changeItemName();
      }
    }
  };

  const downloadFile = async () => {
    await getFile(
      "ShoppingList/getAsFile?listId=" + selectedList?.id,
      selectedList?.listname + ".txt"
    );
  };

  if (!selectedList) {
    return null;
  }
  return (
    <div>
      <div className={classes.titleCont}>
        <Typography variant="h6" className={classes.title}>
          Liste - {globalState.selectedList?.listname}
        </Typography>
        <div>
          <Fab onClick={downloadFile}>
            <GetAppIcon />
          </Fab>
        </div>
      </div>
      <Grid container className={classes.list}>
        <Grid item xs={12} md={10} lg={8}>
          <Card className={classes.card}>
            <List className={classes.listPad}>
              {selectedList.items.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem button onClick={onItemCheck(item)}>
                      {item.id === editItemId ? (
                        <ListItemText disableTypography>
                          <TextField
                            className={classes.listItemInput}
                            variant="outlined"
                            value={editedItem}
                            onChange={event =>
                              setEditedItem(event.target.value)
                            }
                            onKeyDown={onKeyDown(false)}
                            InputProps={{
                              classes: {
                                input: classes.input
                              }
                            }}
                            fullWidth
                          />
                        </ListItemText>
                      ) : (
                        <ListItemText
                          className={
                            item.isChecked ? classes.itemIsChecked : ""
                          }
                        >
                          {item.itemname}
                        </ListItemText>
                      )}
                      <ListItemSecondaryAction>
                        <IconButton onClick={onEditModeItem(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={onDeleteItem(item)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
              <React.Fragment key={"newItem"}>
                <ListItem>
                  <ListItemText disableTypography>
                    <TextField
                      variant="outlined"
                      value={newItem}
                      onChange={event => setNewItem(event.target.value)}
                      onKeyDown={onKeyDown(true)}
                      InputProps={{
                        classes: {
                          input: classes.input
                        }
                      }}
                      fullWidth
                    />
                  </ListItemText>
                </ListItem>
                <Divider />
              </React.Fragment>
            </List>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ShoppingListView;
