import axios from "axios";

const BASE_URL = "http://localhost:5000/api/"

export const publicRequest = axios.create({
    baseURL: BASE_URL,
})

// Function to create a userRequest with a dynamic token
export const userRequest = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: { token: `Bearer ${token}` },
    });
};