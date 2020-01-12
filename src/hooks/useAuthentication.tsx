/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
    Reducer,
    createContext,
    useReducer,
    Dispatch,
    useContext
  } from 'react';
  import { IAuthentication } from '../models/IAuthentication';
  import LocalStorageUtiltites from '../utils/LocalStorageUtilities';
  interface IProvider {
    children: React.ReactNode;
    initialState: IAuthentication | undefined;
    reducer: Reducer<any, any>;
  }
  
  interface IReducerAction {
    type: ActionType;
    token?: string;
  }
  
  type ActionType = 'setToken' | 'removeToken';
  
  const AuthenticationContext = createContext({} as any);
  
  export const AuthenticationReducer = (
    oldState: IAuthentication,
    action: IReducerAction
  ): IAuthentication => {
    if (action.type === 'setToken') {
      LocalStorageUtiltites.jwtToken = action.token || '';
      return { jwttoken: LocalStorageUtiltites.jwtToken };
    } else if (action.type === 'removeToken') {
      LocalStorageUtiltites.jwtToken = '';
      return { jwttoken: '' };
    }
    return oldState;
  };
  
  export const AuthenticationProvider = ({
    children,
    initialState,
    reducer
  }: IProvider): JSX.Element => {
    if (!initialState) {
      initialState = {
        jwttoken: LocalStorageUtiltites.jwtToken
      } as IAuthentication;
    }
    return (
      <AuthenticationContext.Provider value={useReducer(reducer, initialState)}>
        {children}
      </AuthenticationContext.Provider>
    );
  };
  
  export const useAuthentication = (): IAuthentication => {
    const [authentication] = useContext<
      [IAuthentication, Dispatch<IReducerAction>]
    >(AuthenticationContext);
    return authentication;
  };
  
  export const useAuthenticationReducer = (): Dispatch<IReducerAction> => {
    const [, dispatch] = useContext<[IAuthentication, Dispatch<IReducerAction>]>(
      AuthenticationContext
    );
    return dispatch;
  };