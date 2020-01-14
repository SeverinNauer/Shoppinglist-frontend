import React from "react";
import { useAuthentication } from "./../hooks/useAuthentication";
import { useHistory } from "react-router-dom";
import Drawer from "../components/Drawer";
import ListOverview from "./ListOverview";

const MainPage = () => {
  const auth = useAuthentication();
  const history = useHistory();
  if (!auth.jwttoken) {
    history.push("/login");
  }
  return (
    <Drawer>
      <ListOverview />
    </Drawer>
  );
};

export default MainPage;
