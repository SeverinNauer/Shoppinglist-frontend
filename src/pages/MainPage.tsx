import React from "react";
import { useAuthentication } from "./../hooks/useAuthentication";
import { useHistory } from "react-router-dom";
import Drawer from "../components/Drawer";
import ListOverview from "./ListOverview";
import { GlobalStateProvider, GlobalStateReducer } from "../hooks/useGlobalState";

const MainPage = () => {
  const auth = useAuthentication();
  const history = useHistory();
  if (!auth.jwttoken) {
    history.push("/login");
  }
  return (
    <GlobalStateProvider initialState={undefined} reducer={GlobalStateReducer}>
      <Drawer>
        <ListOverview />
      </Drawer>
    </GlobalStateProvider>
  );
};

export default MainPage;
