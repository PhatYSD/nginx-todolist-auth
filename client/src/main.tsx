import ReactDOM from "react-dom/client"
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App";
import TodoList from "./pages/TodoList";
import Auth from "./pages/Auth";
import { store } from "./store/store";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/auth",
                element: <Auth />
            },
            {
                path: "/",
                element: <TodoList />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")!)
    .render(
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );