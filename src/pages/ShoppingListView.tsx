import {
  Card,
  createStyles,
  Divider,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  TextField,
  Theme,
  Typography
} from "@material-ui/core";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from "@material-ui/icons/GetApp";
import React, { useState, useCallback } from "react";
import { useGlobalState, useGlobalStateReducer } from "../hooks/useGlobalState";
import IListItem from "../models/IListItem";
import IShoppingList from "../models/IShoppingList";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { IChangeIsFavourite } from "./ListOverview";
import useFetch from "../services/fetchservice";

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
      marginTop: theme.spacing(3),
      height: "calc(100vh - 200px)",
      overflowY: "auto"
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
    },
    downloadButton: {
      marginLeft: theme.spacing(1)
    },
    editButton: {
      marginRight: theme.spacing(1)
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

interface IChangeListName {
  listId: number;
  listName: string;
}

const ShoppingListView = () => {
  const globalState = useGlobalState();
  const globalStateDispatch = useGlobalStateReducer();
  const classes = useStyles();
  const [newItem, setNewItem] = useState("");
  const [editedItem, setEditedItem] = useState("");
  const [editItemId, setEditItemId] = useState(-1);
  const selectedList = globalState.selectedList;
  const [newListName, setNewListName] = useState(selectedList?.listname);
  const [isEditMode, setIsEditMode] = useState(false);
  const [get, post, put, getFile, isSuccess] = useFetch();

  const fetchAllLists = useCallback(async () => {
    const response = await get<IShoppingList[]>("ShoppingList/getAll", true);
    if (isSuccess(response)) {
      globalStateDispatch({
        type: "setAllLists",
        lists: response as IShoppingList[]
      });
    }
  }, [globalStateDispatch, isSuccess, get]);

  const onItemCheck = (item: IListItem) => async () => {
    if(editItemId === item.id){
      return;
    }
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

  const onListnameChangeKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.keyCode === 13 && newListName) {
      const response = await put<IChangeListName, IShoppingList>(
        "ShoppingList/changeListname",
        { listId: selectedList!.id, listName: newListName || "" },
        true
      );
      if (isSuccess(response)) {
        await fetchAllLists();
        globalStateDispatch({
          type: "setShoppingList",
          selectedList: response as IShoppingList
        });
        setIsEditMode(false);
      }
    }
  };

  const downloadFile = async () => {
    await getFile(
      "ShoppingList/getAsFile?listId=" + selectedList?.id,
      selectedList?.listname + ".txt"
    );
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
      await fetchAllLists();
      globalStateDispatch({
        type: "setShoppingList",
        selectedList: response as IShoppingList
      });
    }
  };

  if (!selectedList) {
    return null;
  }
  return (
    <div>
      <div className={classes.titleCont}>
        {isEditMode ? (
          <TextField
            className={classes.listItemInput}
            color="secondary"
            variant="outlined"
            value={newListName}
            onChange={event => setNewListName(event.target.value)}
            onKeyDown={onListnameChangeKeyDown}
            InputProps={{
              classes: {
                input: classes.input
              }
            }}
          />
        ) : (
          <Typography variant="h6" className={classes.title}>
            {globalState.selectedList?.listname}
          </Typography>
        )}
        <div>
          <Fab
            onClick={() => setIsEditMode(!isEditMode)}
            className={classes.editButton}
          >
            <EditIcon />
          </Fab>
          {globalState?.selectedList?.isFavourite ? (
            <Fab
              onClick={setListIsFavourite(globalState.selectedList.id, false)}
            >
              <StarIcon />
            </Fab>
          ) : (
            <Fab
              onClick={setListIsFavourite(globalState?.selectedList!.id, true)}
            >
              <StarBorderIcon />
            </Fab>
          )}
          <Fab onClick={downloadFile} className={classes.downloadButton}>
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
                            autoFocus
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
