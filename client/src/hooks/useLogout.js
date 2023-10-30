import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {

    const { dispatch } = useAuthContext();

    const logout = async () => {
        //Step 1 --> Remove User from Local Storage
        localStorage.removeItem('user');
        //Dispatch LOGOUT
        dispatch({ type: 'LOGOUT' });
    }

    return { logout };
}