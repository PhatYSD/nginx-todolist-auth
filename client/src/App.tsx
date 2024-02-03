import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";
import { SnackbarProvider } from "notistack";
import { Outlet, useNavigate } from "react-router-dom";

import axiosPath from "./api/axiosPath";
import Navbar from "./components/Navbar";
import { useAppDispatch } from "./store/store";
import { authSeletor, login } from "./store/slices/authSlice";

export default function App() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { login: { isLogin } } = useSelector(authSeletor);

    const getUser = async () => {
        try {
            const response = await axiosPath.get("auth");

            dispatch(login({isLogin: true, user: response.data}));
        } catch (error) {
            dispatch(login({isLogin: false, user: null}));
        }
    }

    useEffect(() => {
        if (!cookies.get("refreshToken")) {
            dispatch(login({isLogin: false, user: null}));
            navigate("/auth");
        } else {
            getUser();
        }
    }, [isLogin]);

    return (
        <>
            <Navbar />
            <Outlet />
            <SnackbarProvider autoHideDuration={5000} />
        </>
    );
}