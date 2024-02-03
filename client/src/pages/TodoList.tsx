import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import axiosPath from "../api/axiosPath";
import { useAppDispatch } from "../store/store";
import { createListAsync, listSeletor, loadListsAsync } from "../store/slices/listSlice";

export default function TodoList() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [list, setList] = useState<string>("");
    const { data, status, error } = useSelector(listSeletor);

    const handerAddList = async (list: string) => {
        const next = await dispatch(createListAsync(list));

        if (next.payload) {
            navigate(0);
        }
    }

    const handerCheck = async (e: React.ChangeEvent<HTMLInputElement>, listId: string) => {
        try {
            if (!e.target.checked) {
                await axiosPath.patch(`todoList/undo/${listId}`);
            } else {
                await axiosPath.patch(`todoList/do/${listId}`);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                enqueueSnackbar(error.response?.data);
            }
        }
    }

    const handerDelete = async (listId: string) => {
        try {
            await axiosPath.delete(`todoList/${listId}`);
            navigate(0);
        } catch (error) {
            if (error instanceof AxiosError) {
                enqueueSnackbar(error.response?.data || error.message);
            }
        }
    }

    useEffect(() => {
        if (status === "idle") {
            dispatch(loadListsAsync());
        }
        if (status === "failed") {
            enqueueSnackbar(error);
        }
    }, [status]);

    return (
        <div className="w-full mt-4 flex flex-col justify-center items-center gap-4">
            <h1 className="text-4xl font-medium">TodoList</h1>
            <div className="w-80 flex justify-between items-center gap-2">
                <input onChange={e => setList(e.target.value)} className="flex-1 outline-none border-2 border-black rounded px-1" type="text" placeholder="Your To Do." value={list} />
                <button onClick={() => handerAddList(list)} className="bg-black text-white font-medium px-2 border-2 border-black rounded">Add</button>
            </div>
            <div className="w-80 mb-4 flex flex-col justify-start items-center gap-2">
                {
                    data?.map(value => (
                        <div key={value.id} className="w-full border-y border-black flex justify-between items-center gap-2">
                            <input onChange={e => handerCheck(e, value.id)} type="checkbox" defaultChecked={value.do} />
                            <div className="flex-1 py-2">{value.list}</div>
                            <button onClick={() => handerDelete(value.id)} className="bg-black text-white font-medium px-1 rounded">Delete</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}