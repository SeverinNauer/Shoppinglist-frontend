/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  Dispatch,
  Reducer,
  useContext,
  useReducer
} from "react";
import IShoppingList from "../models/IShoppingList";

interface IProvider {
  children: React.ReactNode;
  initialState: IGlobalState | undefined;
  reducer: Reducer<any, any>;
}

interface IGlobalState {
  lists: IShoppingList[];
  selectedList: IShoppingList | undefined;
}

interface IReducerAction {
  type: ActionType;
  lists?: IShoppingList[];
  selectedList?: IShoppingList;
}

type ActionType = "setShoppingList" | "removeShoppingList" | "setAllLists";

const GlobalStateContext = createContext({} as any);

export const GlobalStateReducer = (
  oldState: IGlobalState,
  action: IReducerAction
): IGlobalState => {
  if (action.type === "setShoppingList") {
    return {
      ...oldState,
      selectedList: action.selectedList
    };
  } else if (action.type === "removeShoppingList") {
    return { ...oldState, selectedList: undefined };
  } else if (action.type === "setAllLists") {
    return {
      selectedList: undefined,
      lists: action.lists || new Array<IShoppingList>()
    };
  }
  return oldState;
};

export const GlobalStateProvider = ({
  children,
  initialState,
  reducer
}: IProvider): JSX.Element => {
  if (!initialState) {
    initialState = {
      lists: new Array<IShoppingList>(),
      selectedList: undefined
    } as IGlobalState;
  }
  return (
    <GlobalStateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): IGlobalState => {
  const [globalState] = useContext<[IGlobalState, Dispatch<IReducerAction>]>(
    GlobalStateContext
  );
  return globalState;
};

export const useGlobalStateReducer = (): Dispatch<IReducerAction> => {
  const [, dispatch] = useContext<[IGlobalState, Dispatch<IReducerAction>]>(
    GlobalStateContext
  );
  return dispatch;
};
