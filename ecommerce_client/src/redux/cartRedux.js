import {createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        products: [],
        quantity: 0,
        total: 0
    },
    reducers: {
        addProduct: (state, action) => {
            state.quantity += 1;
            state.products.push(action.payload);
            state.total += action.payload.price * action.payload.quantity;
        },
        deleteProduct: (state, action) => {
            const productId = action.payload; // The ID of the product to be deleted
            const product = state.products.find((item) => item._id === productId);
            
            if (product) {
                state.quantity -= 1;
                state.products = state.products.filter((item) => item._id !== productId);
                state.total -= product.price * product.quantity;
            }
        },
        resetCart: (state) => {
            state.products = [];
            state.quantity = 0;
            state.total = 0;
        }
    }
})

export const {addProduct, resetCart, deleteProduct} = cartSlice.actions;
export default cartSlice.reducer;