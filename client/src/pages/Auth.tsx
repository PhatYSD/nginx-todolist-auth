import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../store/store";
import { loginAsync, registerAsync, authSeletor } from "../store/slices/authSlice";

interface AuthLoginForm {
    l_username: string;
    l_password: string;
}

interface AuthSignUpForm {
    s_username: string;
    s_password: string;
}

export default function Auth() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const login = useSelector(authSeletor);
    const [loginForm, setLoginForm] = useState<AuthLoginForm>({ l_username: "", l_password: "" });
    const [signUpForm, setSignUpForm] = useState<AuthSignUpForm>({ s_username: "", s_password: "" });

    const handerLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const handerSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handerLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(loginAsync({ username: loginForm.l_username, password: loginForm.l_password }));
    }
    const handerSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(registerAsync({ username: signUpForm.s_username, password: signUpForm.s_password }));
    }

    useEffect(() => {
        if (login.login.isLogin) {
            navigate("/");
            navigate(0);
        }
    }, [login.login.isLogin]);

    useEffect(() => {
        if (login.status === "failed") {
            if (login.error !== null) {
                const errors: string[] = login.error.split(", ");
                enqueueSnackbar(errors[0] + ` and ${errors.length} validate.`);
            }
        }
        if (login.status === "succeeded") {
            enqueueSnackbar(`Welcome, ${login.login.user}`);
        }
    }, [login.status]);

    return (
        <div className="w-full min-h-fit flex flex-col justify-center items-center gap-2">
            <form name="login" onSubmit={handerLogin} className="w-[524px] flex flex-col justify-center items-center gap-2">
                <div className="text-2xl font-medium">Login</div>
                <input onChange={handerLoginChange} className="text-center w-1/2 outline-none border border-black rounded" type="text" placeholder="username" name="l_username" id="l-username" value={loginForm.l_username} required />
                <input onChange={handerLoginChange} className="text-center w-1/2 outline-none border border-black rounded" type="text" placeholder="password" name="l_password" id="l-password" value={loginForm.l_password} required />
                <input type="submit" className="text-center text-white w-1/2 mt-2 bg-black rounded cursor-pointer" value={"Login"} />
            </form>
            <div className="w-60 flex justify-center items-center gap-4">   
                <hr className="flex-1 border border-t-0 border-slate-400" />
                <p className="text-sm text-slate-400">or</p>
                <hr className="flex-1 border border-t-0 border-slate-400" />
            </div>
            <form name="sign_up" onSubmit={handerSignUp} className="w-[524px] flex flex-col justify-center items-center gap-2">
                <div className="text-2xl font-medium">Sign Up</div>
                <input onChange={handerSignUpChange} className="text-center w-1/2 outline-none border border-black rounded" type="text" placeholder="username" name="s_username" id="s-username" value={signUpForm.s_username} required />
                <input onChange={handerSignUpChange} className="text-center w-1/2 outline-none border border-black rounded" type="text" placeholder="password" name="s_password" id="s-password" value={signUpForm.s_password} required />
                <input type="submit" className="text-center text-white w-1/2 mt-2 bg-black rounded cursor-pointer" value={"Sign Up"} />
            </form>
        </div>
    );
}