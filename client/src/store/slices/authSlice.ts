import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { RootState } from "../store";
import axiosPath from "../../api/axiosPath";

interface InitialState {
    login: {
        isLogin: boolean;
        user: null | string;
    },
    status: "idle" | "loading" | "succeeded" | "failed";
    error: null | string;
}

const initialState: InitialState = {
    login: {
        isLogin: false,
        user: null
    },
    status: "idle",
    error: null
}

interface AuthAsyncValue {
    username: string;
    password: string;
}
interface ErrorLogin {
    msg: string;
    path: string;
}

export const loginAsync = createAsyncThunk("auth/loginAsync", async (value: AuthAsyncValue) => {
    try {
        const login = await axiosPath.post("auth/", value);

        const user = {
            user: value.username,
            message: login.data
        }
        return user;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            let errorStr: string = "";
            const lengthError: number = error.response?.data.length;

            if (Array.isArray(error.response?.data)) {
                error.response?.data.forEach((element: ErrorLogin, index: number) => {
                    errorStr += (`${element.path}: ${element.msg}`);
                    if (index < lengthError - 1) {
                        errorStr += ", ";
                    }
                });
            }

            errorStr += error.response?.data;
            
            throw errorStr;
        }

        throw error.message;
    }
});
export const registerAsync = createAsyncThunk("auth/registerAsync", async (value: AuthAsyncValue) => {
    try {
        const login = await axiosPath.post("auth/register", value);

        const user = {
            user: value.username,
            message: login.data
        }
        return user;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            let errorStr: string = "";
            const lengthError: number = error.response?.data.length;

            if (Array.isArray(error.response?.data)) {
                error.response?.data.forEach((element: ErrorLogin, index: number) => {
                    errorStr += (`${element.path}: ${element.msg}`);
                    if (index < lengthError - 1) {
                        errorStr += ", ";
                    }
                });
            }

            errorStr += error.response?.data;
            
            throw errorStr;
        }

        throw error.message;
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.login.isLogin = action.payload.isLogin;
            state.login.user = action.payload.user;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, value => {
                value.status = "loading";
            })
            .addCase(loginAsync.fulfilled, (value, action) => {
                value.status = "succeeded";
                value.login.isLogin = true;
                value.login.user = action.payload?.user as string;
                value.error = null;
            })
            .addCase(loginAsync.rejected, (value, action) => {
                value.status = "failed";
                value.error = action.error.message || "";
            });
        builder
            .addCase(registerAsync.pending, value => {
                value.status = "loading";
            })
            .addCase(registerAsync.fulfilled, (value, action) => {
                value.status = "succeeded";
                value.login.isLogin = true;
                value.login.user = action.payload?.user as string;
                value.error = null;
            })
            .addCase(registerAsync.rejected, (value, action) => {
                value.status = "failed";
                value.error = action.error.message || "";
            })
    }
});

export const { login } = authSlice.actions;
export const authSeletor = (state: RootState) => state.auth;
export default authSlice.reducer;