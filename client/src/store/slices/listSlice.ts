import { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../store";
import axiosPath from "../../api/axiosPath";

interface InitialState {
    data: null | {
        id: string;
        list: string;
        do: boolean
    }[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: null | string;
}

const initialState: InitialState = {
    data: null,
    status: "idle",
    error: null
}

export const loadListsAsync = createAsyncThunk("list/loadList", async () => {
    try {
        const response = await axiosPath.get("/todoList");
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            let msgError: string = "";
            if (Array.isArray(error.response?.data)) {
                const lengthError: number = error.response.data.length;
                error.response.data.forEach((value, index) => {
                    msgError += value.msg;

                    if (index < lengthError - 1) {
                        msgError += ", ";
                    }
                });
            } else {
                msgError += error.response?.data;
            }

            throw msgError;
        }
        throw error.message;
    }
});

export const createListAsync = createAsyncThunk("list/createListAsync", async (value: string) => {
    try {
        const response = await axiosPath.post("todoList", { list: value });

        return {
            message: response.data,
            list: value,
            do: false,
            id: Math.random() * 100
        };
    } catch (error: any) {
        if (error instanceof AxiosError) {
            let msgError: string = "";
            if (Array.isArray(error.response?.data)) {
                const lengthError: number = error.response.data.length;
                error.response.data.forEach((value, index) => {
                    msgError += value.msg;

                    if (index < lengthError - 1) {
                        msgError += ", ";
                    }
                });
            } else {
                msgError += error.response?.data;
            }

            throw msgError;
        }
        throw error.message;
    }
});

const listSlice = createSlice({
    name: "list",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadListsAsync.pending, value => {
                value.status = "loading";
            })
            .addCase(loadListsAsync.fulfilled, (value, action) => {
                value.status = "succeeded";
                value.data = action.payload;
                value.error = null
            })
            .addCase(loadListsAsync.rejected, (value, payload) => {
                value.status = "failed";
                value.error = payload.error.message as string;
            });
        builder
            .addCase(createListAsync.pending, value => {
                value.status = "loading";
            })
            .addCase(createListAsync.fulfilled, (value, action) => {
                value.status = "succeeded";
                value.error = null;
                if (value.data === null) {
                    value.data = [{
                        id: action.payload.id.toString(),
                        list: action.payload.list,
                        do: action.payload.do
                    }]
                } else {
                    value.data = [...value.data, {
                        id: action.payload.id.toString(),
                        list: action.payload.list,
                        do: action.payload.do
                    }]
                }
            })
            .addCase(createListAsync.rejected, (value, action) => {
                value.status = "failed";
                value.error = action.error.message as string;
            })
    }
});

export const { } = listSlice.actions;
export const listSeletor = (state: RootState) => state.list;
export default listSlice.reducer;