import { loginStart, loginSuccess, loginFailure } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import { addProductFailue, addProductStart, addProductSuccess, deleteProductFailue, deleteProductStart, deleteProductSuccess, getProductFailure, getProductStart, getProductSuccess, updateProductFailue, updateProductStart, updateProductSuccess } from "./productRedux";
import { addUserFailue, addUserStart, addUserSuccess, deleteUserFailue, deleteUserStart, deleteUserSuccess, getUsersFailure, getUsersStart, getUsersSuccess, updateUserFailue, updateUserStart, updateUserSuccess } from "./usersRedux";
import { logOut } from "./userRedux";
import { deleteOrderFailure, deleteOrderStart, deleteOrderSuccess, getOrderFailure, getOrderStart, getOrderSuccess } from "./orderRedux";

export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("/auth/login", user);
        console.log("RES: ", res.data);
        dispatch(loginSuccess(res.data));
    } catch (error) {
        console.error("Login error:", error);
        dispatch(loginFailure());
    }
}

export const logout = async (dispatch) => {
    dispatch(logOut());
}

export const getProducts = async (dispatch) => {
    dispatch(getProductStart());

    try {
        const res = await publicRequest.get("/products");
        dispatch(getProductSuccess(res.data));
    } catch (error) {
        dispatch(getProductFailure());
    }
}

export const deleteProduct = async (dispatch, id) => {
    dispatch(deleteProductStart());

    try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).delete(`/products/${id}`);
        dispatch(deleteProductSuccess(id));
    } catch (error) {
        dispatch(deleteProductFailue());
    }
}

export const updateProduct = async (dispatch, product, pid) => {
    dispatch(updateProductStart());
    console.log("product: \n",product);
    console.log("pid: \n",pid);
    try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).put(`/products/${pid}`, product);
        dispatch(updateProductSuccess(res.data));
        alert("Product updated!");
    } catch (error) {
        dispatch(updateProductFailue());
    }
}

export const addProduct = async (dispatch, product) => {
    dispatch(addProductStart());

    try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).post(`/products/`, product);
        dispatch(addProductSuccess(res.data));
        alert("Product created!");
    } catch (error) {
        dispatch(addProductFailue());
    }
}


export const getUsers = async (dispatch) => {
    dispatch(getUsersStart());

    try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).get("/users");
        dispatch(getUsersSuccess(res.data));
    } catch (error) {
        dispatch(getUsersFailure());
    }
}

export const deleteUser = async (dispatch, id) => {
    dispatch(deleteUserStart());

    try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).delete(`/users/${id}`);
        dispatch(deleteUserSuccess(id));
    } catch (error) {
        dispatch(deleteUserFailue());
    }
}

export const updateUser = async (dispatch, user, id) => {
    dispatch(updateUserStart());
    try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).put(`/users/${id}`, user);
        dispatch(updateUserSuccess(res.data));
        alert("User updated!");
    } catch (error) {
        dispatch(updateUserFailue());
    }
}

export const addUser = async (dispatch, user) => {
    dispatch(addUserStart());

    try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).post(`/users/`, user);
        dispatch(addUserSuccess(res.data));
        alert("User created!");
    } catch (error) {
        dispatch(addUserFailue());
    }
}

// Fetch orders from the backend
export const getOrders = async (dispatch) => {
    console.log("get orders has been called")
    dispatch(getOrderStart());
    try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).get("/orders");
        dispatch(getOrderSuccess(res.data)); // Dispatch success action with fetched orders
    } catch (err) {
        dispatch(getOrderFailure()); // Dispatch failure action on error
    }
  };
  
// Delete an order
export const deleteOrder = async (dispatch, id) => {
  dispatch(deleteOrderStart());
  try {
    const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
    const res = await userRequest(token).delete(`/orders/${id}`); // Replace with your API endpoint
    dispatch(deleteOrderSuccess(id)); // Dispatch success action with order ID to delete
  } catch (err) {
    dispatch(deleteOrderFailure()); // Dispatch failure action on error
  }
};