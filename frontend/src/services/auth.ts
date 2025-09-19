import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export async function signupUser(user: { username: string; password: string }) {
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, user);
    return response.data;
}


export async function signinUser(user: { username: string; password: string }) {
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, user);
    return response.data;
}
