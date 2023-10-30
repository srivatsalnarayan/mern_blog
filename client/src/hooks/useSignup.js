import React from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

export const useSignUp = () => {
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(null);
    const { dispatch } = useAuthContext();

    const signUp = async (email, password) => {
        //Step 1 -- Set the Loading and Reset the Error
        setError(null);
        setIsLoading(true);
        //Step 2 --> Send the Request
        const config = {
            method: "POST",
            headers: { 'Content-type': 'application/json' }
        }
        const data = JSON.stringify({
            email: email,
            password: password
        });
        const response = await axios.post('http://localhost:4000/api/v2/users/signup', data, config).catch((err) => {
            setError(err.response.data.error);
            setIsLoading(false);
        });
        //Step 3 --> Receive
        const json = await response.data;
        //Step 4 --> Check -- Handle Errors
        if (response.status === 201) {
            //Save the user to Local Storage
            localStorage.setItem('user', JSON.stringify(json));
            //Update the Auth Context
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
        }
    }

    return { signUp, isLoading, error };
} 