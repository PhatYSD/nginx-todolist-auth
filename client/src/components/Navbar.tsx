import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";

import axiosPath from "../api/axiosPath";
import { useAppDispatch } from "../store/store";
import { login } from "../store/slices/authSlice";
import { authSeletor } from "../store/slices/authSlice";

export default function Navbar() {
    const { login: { isLogin } } = useSelector(authSeletor);
    const dispatch = useAppDispatch();

    const handerLogout = async () => {
        try {
            const response = await axiosPath.delete("auth");

            enqueueSnackbar(response.data);
            dispatch(login({ isLogin: false, user: null }));
        } catch (error) {
            enqueueSnackbar(error instanceof Error ? error.message : "Client Error.");
        }
    }
    
    return (
        <nav className="w-full h-20 bg-black">
            <div className="max-w-[1024px] w-full h-full mx-auto flex justify-between items-center">
                <Link to={"/"} className="text-white text-2xl font-bold">Todolist</Link>
                {
                    !isLogin ? (
                        <Link to={"/auth"} className="text-white text-xl font-bold p-2 border-2 border-white rounded-lg cursor-pointer">Login</Link>
                    ) : (
                        <div onClick={() => handerLogout()} className="text-white text-xl font-bold p-2 border-2 border-white rounded-lg cursor-pointer">Logout</div>
                    )
                }
            </div>
        </nav>
    );
}