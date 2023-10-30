import React from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(null);
    const { dispatch } = useAuthContext();

    /**
     * Login Function 
     */
    const login = async (email, password) => {
        //Step 1 --> Start the Process 
        setIsLoading(true);
        setError(null);
        //Step 2 --> Request
        const config = {
            method: "POST",
            headers: { 'Content-type': 'application/json' }
        }
        const data = JSON.stringify({
            email: email,
            password: password
        });
        const response = await axios.post('http://localhost:4000/api/v2/users/login', data, config).catch((err) => {
            setError(err.response.data.error);
            setIsLoading(false);
        });
        //Step 3 --> Receive
        const json = await response.data;
        //Step 4 --> Adjust the Context data
        if (response.status === 200) {
            //Save the user to Local Storage
            localStorage.setItem('user', JSON.stringify(json));
            //Update the Auth Context
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
        }
    }

    //Return
    return { login, error, isLoading };
}