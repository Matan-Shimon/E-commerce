import { loginStart, loginSuccess, loginFailure, logOut, registerStart, registerSuccess, registerFailure } from "./userRedux";
import { deleteProduct } from "./cartRedux";
import { publicRequest, userRequest } from "../requestMethods";

export const login = async (dispatch, user, navigate) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("/auth/login", user);
        dispatch(loginSuccess(res.data));
        navigate("/");

    } catch (error) {
        // Check if the error response is a 401
        if (error.response && error.response.status === 401) {
            alert(error.response.data); // Display the error message from the server
        }
        dispatch(loginFailure());
    }
}

export const register = async (dispatch, user, navigate) => {
    dispatch(registerStart());

    try {
        console.log("USER FROM API CALLS\n", user);
        const res = await publicRequest.post("/auth/register", user);
        const res1 = await publicRequest.post("/auth/login", {
            username: user.username,
            password: user.password
        })
        dispatch(registerSuccess(res.data));
        navigate("/");
    } catch {
        dispatch(registerFailure());
    }
}

export const logout = async (dispatch) => {
    dispatch(logOut());
}