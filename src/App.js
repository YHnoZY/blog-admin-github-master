import { useRoutes } from "react-router-dom"
import routers from './routers'
import 'antd/dist/antd.min.css';
import './index.css'

const App = () => {
    return (useRoutes(routers))
}

export default App