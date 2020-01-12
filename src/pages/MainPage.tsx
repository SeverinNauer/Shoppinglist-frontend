import React from "react";
import { useAuthentication } from './../hooks/useAuthentication';
import { useHistory } from "react-router-dom";

const MainPage = () => {
    const auth = useAuthentication();
    const history = useHistory()
    if(!auth.jwttoken){
        history.push("/login")
    }
    return <div>Main</div>
}

export default MainPage;