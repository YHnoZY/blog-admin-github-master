import { useNavigate } from 'react-router-dom'
import './index.css'

const NotFound = () => {
    const navi = useNavigate()
    return (
        <div className='nfpage'>
            <main>
                <div className="wrap">
                    <div className="child">
                        {/* ---- 404 picture ----*/}
                        <div className="imgpart">
                            <img className="img" src={require('../../assets/404.gif')} alt="404 Pic"/>
                        </div>
                    </div>

                    <div className="child">
                        {/* ---- 404 page description ----*/}
                        <div className="contpart">
                            <h1 className='nfh1'>404</h1>
                            <h2 className='nfh2'>ERROR</h2>
                            <p >抱歉，网页迷失中……</p>
                            <a onClick={()=>navi('/',{replace:true})}><button className="btn green">返回首页</button></a>
                        </div>
                    </div>
                </div>

            </main>
            <div className="footer">
                <p>Designed & Powered by YHnoZY</p>
                <p>Aug 2022</p>
            </div>
        </div>
    )
}

export default NotFound