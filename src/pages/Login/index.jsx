import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Divider, Carousel, notification } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import SliderBar from '../../utils/sliderbar';
import md5 from 'blueimp-md5';
import axios from 'axios';
import './index.css'

const Login = () => {
    const [userid, setUserid] = useState('')
    const [password, setPassword] = useState('')
    const [pdcheck, setPdCheck] = useState(false)
    const [vertivisi, setVertivisi] = useState(false)//验证可视
    const [isvertify, setIsVertify] = useState(false)//验证结果
    const changeinputtype = useRef()
    const navi = useNavigate()

    //密码显示与隐藏
    const showpw = (e) => {
        if (!pdcheck) {
            setPdCheck(true)
            changeinputtype.current.type = 'text'
            e.target.src = require('../../assets/loginpage/open.png')
        }
        else {
            setPdCheck(false)
            changeinputtype.current.type = 'password'
            e.target.src = require('../../assets/loginpage/close.png')
        }
    }

    //提交登录
    const submitInfo = async () => {
        if (!password || !userid) {
            setIsVertify(false)//验证还原
            return feedbackinfo(1, '账户或密码不可为空')
        }
        if (!isvertify) return feedbackinfo(1, '请进行验证')

        //提交账户密码
        try {
            const data = new Date()
            let tim = 000 //Encryption is done here
            tim = 000//Encryption is done here, and set Time-based One-time Password 
            const res = await axios({
                method: 'POST',
                url: '/api/admin/login',
                data: {
                    username: userid,
                    password: "Encryption is done here"+password,
                    tim
                }
            })
            // console.log(res);
            if (res.data.code === 0) {
                feedbackinfo(2, '登录成功,正在跳转……')
                return setTimeout(() => { navi('/admin', { replace: true }) }, 1500)
            } else if (res.data.code === 1) {
                setIsVertify(false)//验证还原
                return feedbackinfo(1, '账号密码错误')
            } else {
                setIsVertify(false)//验证还原
                return feedbackinfo(1, '未知错误')
            }
        } catch (error) {
            setIsVertify(false)//验证还原
            return feedbackinfo(1, '服务器连接错误')
        }
    };

    function feedbackinfo(statuscode, info, description = '') {
        switch (statuscode) {
            case 1:
                return (
                    notification.open({
                        message: info,
                        description,
                        icon: (
                            <FrownOutlined style={{ color: 'red' }} />
                        ),
                    })
                )
            case 2:
                return (
                    notification.open({
                        message: info,
                        description,
                        duration: 1,
                        icon: (
                            <SmileOutlined style={{ color: 'skyblue' }} />
                        ),
                    })
                )
            default:
                return null
        }
    }

    return (
        <div className='loginbody'>
            <div className='top'>
                <p>博客后台管理系统登陆界面</p>
            </div>
            <div className='contain'>
                <Carousel autoplay effect="fade">
                    <div>
                        <img src={require('../../assets/loginpage/01.jpg')} alt="" />
                    </div>
                    <div>
                        <img src={require('../../assets/loginpage/05.jpg')} alt="" />
                    </div>
                    <div>
                        <img src={require('../../assets/loginpage/06.jpg')} alt="" />
                    </div>
                </Carousel>
                <div className='logincard'>
                    <br />
                    <Divider orientation="left">
                        <p className='divi'>欢迎登录 博客后台管理系统</p>
                    </Divider>
                    <div className='sumb'>
                        <div className="loginbox">
                            <p>账号</p>
                            <input
                                value={userid}
                                onChange={e => setUserid(e.target.value.trim())}
                            />
                            <p
                                style={{ display: userid ? 'block' : 'none' }}
                                onClick={() => setUserid('')}
                                alt=""
                                id="closign"
                            >
                                x
                            </p>
                        </div>
                        <div className="loginbox">
                            <p>密码</p>
                            <input
                                ref={changeinputtype}
                                type='password'
                                value={password}
                                onChange={e => setPassword(e.target.value.trim())}
                            />
                            <img
                                onClick={e => showpw(e)}
                                src={require("../../assets/loginpage/close.png")}
                                alt=""
                                id="eye" />
                            <p
                                style={{ display: password ? 'block' : 'none' }}
                                onClick={() => setPassword('')}
                                alt=""
                                id="closign"
                            >
                                x
                            </p>
                        </div>
                        <>
                            <button
                                className="slidercheck"
                                onClick={() => {
                                    setVertivisi(true)
                                    SliderBar("slideBar", {
                                        dataList: ["0", "1"],
                                        success: function () {
                                            console.log("验证成功");
                                            setIsVertify(true)
                                            setTimeout(() => {
                                                setVertivisi(false)
                                            }, 800)
                                        },
                                        fail: function () {
                                            console.log("验证失败");
                                        }
                                    })
                                }}
                                style={{
                                    display: (vertivisi || isvertify) ? "none" : "block",
                                    margin: "40px 0px 10px 5px",
                                    fontWeight: 600
                                }}
                            >点击验证</button>
                            <p style={{
                                display: (isvertify & !vertivisi) ? 'block' : 'none',
                                margin: "42px 0 12px 0",
                                color: 'green',
                                fontWeight: 600
                            }}>✓完成验证</p>
                            <div id="slideBar"
                                style={{ display: vertivisi ? "block" : "none" }}
                            ></div>
                        </>
                        <button
                            className="loginbut"
                            type="submit"
                            onClick={submitInfo}
                        >登录</button>
                    </div>

                </div>
            </div>
            <div className='footer'>
                <p>Designed & Powered by YHnoZY</p>
                <p>@2022</p>
            </div>

        </div>
    )
}

export default Login