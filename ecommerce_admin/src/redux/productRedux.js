import { createSlice} from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        // GET ALL
        getProductStart:(state) => {
            state.isFetching = true;
            state.error = false;
        },
        getProductSuccess:(state, action) => {
            state.isFetching = false;
            state.products = action.payload;
        },
        getProductFailue:(state) => {
            state.isFetching = false;
            state.error = true;
        },
        // DELETE
        deleteProductStart:(state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteProductSuccess:(state, action) => {
            state.isFetching = false;
            state.products.splice(
                state.products.findIndex((item) => item._id === action.payload),
                1
            );
        },
        deleteProductFailue:(state) => {
            state.isFetching = false;
            state.error = true;
        },
        // UPDATE
        updateProductStart:(state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateProductSuccess:(state, action) => {
            state.isFetching = false;
            state.products[
                state.products.findIndex((item) => item._id === action.payload._id)
            ] = action.payload;
        },
        updateProductFailue:(state) => {
            state.isFetching = false;
            state.error = true;
        },
        // ADD
        addProductStart:(state) => {
            state.isFetching = true;
            state.error = false;
        },
        addProductSuccess:(state, action) => {
            state.isFetching = false;
            state.products.push(action.payload);
        },
        addProductFailue:(state) => {
            state.isFetching = false;
            state.error = true;
        }
    },
})

export const {
    getProductStart,
    getProductSuccess,
    getProductFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailue,
    updateProductStart,
    updateProductSuccess,
    updateProductFailue,
    addProductStart,
    addProductSuccess,
    addProductFailue
} = productSlice.actions;

export default productSlice.reducer;