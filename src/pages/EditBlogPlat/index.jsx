import { Col, Row, Input, TimePicker, DatePicker, Select, Button, notification, message } from 'antd';
import React, { useState, useEffect } from 'react';
import {
    EditOutlined,
    VerticalAlignTopOutlined,
    FrownOutlined,
    SmileOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom'
import { marked } from 'marked'
import hljs from "highlight.js";
import axios from 'axios';
import moment from 'moment';

const format = 'HH:mm';
const dateformat = 'YYYY/MM/DD HH:mm';
const { TextArea } = Input;
const { Option } = Select;

const Editpalt = () => {
    const [blogId, setBlogId] = useState('')   //文章id
    const [title, setTitle] = useState('')   //文章标题
    const [content, setContent] = useState('')  //markdown的编辑内容
    const [mdcontent, setMdContent] = useState('预览文档') //html内容
    const [intro, setIntro] = useState('')            //简介的markdown内容
    const [mdintro, setMdIntro] = useState('预览简介') //简介的html内容
    const [updateDate, setUpdateDate] = useState('') //发布日志的日期
    const [selectedType, setSelectType] = useState(0) //选择的文章类别
    const [typelist, setTypeList] = useState([]) // 文章类别信息
    const navi = useNavigate()
    const location = useLocation()
    // const editref = useRef()

    //组件加载项
    useEffect(() => {
        getTypeInfo()//获取文章列表信息
        getBlogInfo(location.state.id)//获取文章信息
    },[])

    //获取文章各项操作
    const getBlogInfo = async (blogid) => {
        const res = await axios({
            method: 'POST',
            url: '/api/admin/blogbyid',
            data: {
                blogid
            }
        })
        if (res.data.code === 3) {
            //被后台路由守卫拦截
            message.error(res.data.data)
            return navi('/', { replace: true })
        }
        const { id, title, intro, content, time, typeid } = res.data.data[0]
        setBlogId(id)
        setTitle(title)
        setIntro(intro)
        setMdIntro(marked(intro))
        setContent(content)
        setMdContent(marked(content))
        setSelectType(typeid)
        setUpdateDate(time)
    }
    //获取文章列表操作
    const getTypeInfo = async () => {
        const res = await axios('/api/admin/typelist')
        if(res.data.code === 3){
            //被后台路由守卫拦截
            message.error(res.data.data)
            return navi('/',{replace:true})
        }
        setTypeList(res.data.data)
    }

    //markdown render
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });

    //渲染文档操作
    const editcontent = ({ target: { value } }) => {
        setContent(value)
        if (!value) setMdContent('预览文档')
        else setMdContent(marked(value))
    }

    const editintro = ({ target: { value } }) => {
        setIntro(value)
        if (!value) setMdIntro('预览简介')
        else setMdIntro(marked(value))
    }

    //提交添加博客操作
    // const submitblog = async () => {
    //     console.log(moment(Date.now()).format('YYYY/MM/DD hh:mm'));
    //     console.log(editref.current.value);
    //     if (!title || !content || !intro || !updateDate) return feedbackinfo(1, '必填项不可为空')
    //     try {
    //         const res = await axios({
    //             method: 'POST',
    //             url: '/api/admin/addblog',
    //             data: {
    //                 title, intro, content, addtime: updateDate, type: selectedType
    //             }
    //         })
    //         console.log(res);
    //         if (res.data.code === 0) return feedbackinfo(2, '提交成功')
    //         else return feedbackinfo(1, '提交失败')
    //     } catch (error) {
    //         return feedbackinfo(1, '未知错误,提交失败')
    //     }
    // };

    //提交修改博客操作
    const submiteditblog = async () => {
        if (!blogId || !title || !content || !intro || !updateDate) return feedbackinfo(1, '必填项不可为空')
        try {
            const res = await axios({
                method: 'POST',
                url: '/api/admin/updateblog',
                data: {
                    blogid: blogId,
                    title,
                    intro,
                    content,
                    addtime: updateDate,
                    type: selectedType
                }
            })
            console.log(res);
            if (res.data.code === 0) return feedbackinfo(2, '提交成功')
            else return feedbackinfo(1, '提交失败')
        } catch (error) {
            return feedbackinfo(1, '未知错误,提交失败')
        }
    }

    function feedbackinfo(code, info) {
        switch (code) {
            case 1:
                return (
                    notification.open({
                        message: info,
                        description: '',
                        icon: (
                            <FrownOutlined style={{ color: 'red' }} />
                        ),
                    })
                )
            case 2:
                return (
                    notification.open({
                        message: info,
                        description: '',
                        icon: (
                            <SmileOutlined style={{ color: 'skyblue' }} />
                        ),
                    })
                )
            default:
                return null
        }
    }

    // without initstate without render
    if (typelist === [] || updateDate === '') {
        return (
            <p>loading</p>
        )
    }

    return (
        <>
            <Row gutter={6}>
                <Col span={16}>
                    <Input
                        size="large"
                        placeholder="填写博客标题"
                        prefix={<EditOutlined />}
                        showCount
                        maxLength={50}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <Row gutter={5}>
                        <Col span={12}>
                            <TextArea
                                className='blogedit'
                                placeholder='文档编写'
                                showCount
                                allowClear
                                maxLength={10000}
                                value={content}
                                onChange={e => editcontent(e)}
                            />
                        </Col>
                        <Col span={12}>
                            <div
                                className='blogview'
                                dangerouslySetInnerHTML={{ __html: mdcontent }}
                            >
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={8}>
                    <Select
                        defaultValue={selectedType}
                        size='large'
                        style={{ marginBottom: 10 }}
                        onChange={value => setSelectType(value)}
                    >
                        {
                            typelist.map((item) => {
                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>
                    <br />
                    发布日期：
                    <DatePicker
                        format='YYYY/MM/DD HH:mm'
                        showTime={<TimePicker format={format} />}
                        showNow={true}
                        size="large"
                        style={{ marginBottom: 10 }}
                        defaultValue={
                            updateDate ? moment(moment(parseInt(updateDate * 1000)).format(dateformat), dateformat) :
                                moment(moment(Date.now()).format(dateformat), dateformat)
                        }
                        onChange={e => setUpdateDate(Math.ceil(e._d.getTime() / 1000))}
                    />
                    <TextArea
                        className='introedit'
                        placeholder='简介编写'
                        showCount
                        allowClear
                        maxLength={350}
                        value={intro}
                        onChange={e => editintro(e)}
                    />
                    <div
                        className='introview'
                        style={{ marginBottom: 10 }}
                        dangerouslySetInnerHTML={{ __html: mdintro }}
                    >
                    </div>
                    {/* <Button
                        type="primary"
                        icon={<VerticalAlignTopOutlined />}
                        size="large"
                        onClick={submitblog}
                    >
                        发布博客
                    </Button> */}
                    <br />
                    <br />
                    <Button
                        type="primary"
                        icon={<VerticalAlignTopOutlined />}
                        size="large"
                        onClick={submiteditblog}
                    >
                        提交修改
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default Editpalt