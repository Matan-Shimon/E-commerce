import { createSlice} from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        // GET ALL
        getUsersStart:(state) => {
            state.isFetching = true;
            state.error = false;
        },
        getUsersSuccess:(state, action) => {
            state.isFetching = false;
            state.users = action.payload;
        },
        getUsersFailue:(state) => {
            state.isFetching = false;
            state.error = true;
        },
        // DELETE
        deleteUserStart:(state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteUserSuccess:(state, action) => {
            state.isFetching = false;
            state.users.splice(
                state.users.findIndex((item) => item._id === action.payload),
                1
            );
        },
        deleteUserFailue:(state) => {
            state.isFetching = false;
            state.error = true;
        },
        // UPDATE
        updateUserStart:(state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateUserSuccess:(state, action) => {
            state.isFetching = false;
            state.users[
                state.users.findIndex((item) => item._id === action.payload._id)
            ] = action.payload;
        },
        updateUserFailue:(state) => {
            state.isFetching = false;
            state.error = true;
        },
        // ADD
        addUserStart:(state) => {
            state.isFetching = true;
            state.error = false;
        },
        addUserSuccess:(state, action) => {
            state.isFetching = false;
            state.users.push(action.payload);
        },
        addUserFailue:(state) => {
            state.isFetching = false;
            state.error = true;
        }
    },
})

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailue,
    updateUserStart,
    updateUserSuccess,
    updateUserFailue,
    addUserStart,
    addUserSuccess,
    addUserFailue
} = usersSlice.actions;

export default usersSlice.reducer;