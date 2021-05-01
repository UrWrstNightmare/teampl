import React,{createContext, useState} from "react";
import {authMethods} from "../firebase/authMethods";

export const firebaseAuth = React.createContext({});
const UserProvider = (props) => {
    const [inputs, setInputs] = useState({email: '', password: '', username: '', name: ''});
    const [errors, setErrors] = useState([]);
    const [token, setToken] = useState(null);
    const [metadata, setMetadata] = useState({
        loading: true,
        data: {}
    });
    const [fileToView, setFileToView] = useState({
       loading: true,
       file: ''
    });
    return(
        <firebaseAuth.Provider
            value={{
                handleSignUp,
                inputs, setInputs,
                errors, setErrors,
                setToken, token,
                metadata, setMetadata,
                fileToView, setFileToView
            }}>
            {props.children}
        </firebaseAuth.Provider>
    );
};



const handleSignUp = () => {
    console.log('handleSignUp');
    return authMethods.signup();
};

export default UserProvider;
