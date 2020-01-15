import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { get, isSuccess } from "../services/fetchservice";
import IShoppingList from "./../models/IShoppingList";

const ListOverview = () => {
  const [lists, setLists] = useState(new Array<IShoppingList>());
  useEffect(() => {
    const fetchData = async () => {
      const response = await get<IShoppingList[]>("ShoppingList/getAll", true);
      if (isSuccess(response)) {
        setLists(response as IShoppingList[]);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Typography variant="h6">Listenübersicht</Typography>
      {lists.map(list => {
        return <Typography variant="body2">{list.listname}</Typography>;
      })}
    </div>
  );
};

export default ListOverview;
