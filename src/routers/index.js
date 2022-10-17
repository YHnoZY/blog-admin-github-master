import NotFound from "../pages/404"
import Login from "../pages/Login"
import Admin from '../pages/Admin'
import AddBlogPalt from "../pages/AddBlogPlat"
import EditBlogPalt from "../pages/EditBlogPlat"
import Blogtable from "../pages/Blogtable"
import Systeminfo from "../pages/SystemInfo"
import { Navigate } from "react-router-dom"

const routers = [
    {
        title: '登录',
        path: '/login',
        element: <Login />
    },
    {
        title: '博客管理',
        path: '/admin',
        element: <Admin />,
        children: [
            {
                title: '添加文章',
                path: 'addblog',
                element: <AddBlogPalt />
            },
            {
                title: '博客列表',
                path: 'blogtable',
                element: <Blogtable />
            },
            {
                title: '修改文章',
                path: 'editblog',
                element: <EditBlogPalt />
            },
            {
                path: '/admin',
                element: <Systeminfo />
            }
        ]
    },
    {
        title: '404',
        path: '*',
        element: <NotFound />
    },
    {
        path: '/',
        element: <Navigate to="/login" />
    }
]
export default routers