import { Col, Row, Input, TimePicker, DatePicker, Select, Button, notification, message } from 'antd';
import React, { useState, useEffect } from 'react';
import {
    EditOutlined,
    VerticalAlignTopOutlined,
    FrownOutlined,
    SmileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { marked } from 'marked'
import hljs from "highlight.js";
import axios from 'axios';

const format = 'HH:mm';
const { TextArea } = Input;
const { Option } = Select;

const Addpalt = () => {
    const [title, setTitle] = useState('')   //文章标题
    const [content, setContent] = useState('')  //markdown的编辑内容
    const [mdcontent, setMdContent] = useState('预览文档') //html内容
    const [intro, setIntro] = useState('')            //简介的markdown内容
    const [mdintro, setMdIntro] = useState('预览简介') //简介的html内容
    const [updateDate, setUpdateDate] = useState('') //发布日志的日期
    const [selectedType, setSelectType] = useState(0) //选择的文章类别
    const [typelist, setTypeList] = useState([]) // 文章类别信息
    const navi = useNavigate()

    //组件加载项
    useEffect(() => {
        getTypeInfo()//获取文章列表信息
    },[])

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

    //提交操作
    const submitblog = async () => {
        if (!title || !content || !intro || !updateDate) return feedbackinfo(1, '必填项不可为空')

        try {
            const res = await axios({
                method: 'POST',
                url: '/api/admin/addblog',
                data: {
                    title, intro, content, addtime: updateDate, type: selectedType
                }
            })
            console.log(res);
            if (res.data.code === 0) return feedbackinfo(2, '提交成功')
            else return feedbackinfo(1, '提交失败')
        } catch (error) {
            return feedbackinfo(1, '未知错误,提交失败')
        }
    };

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
    if (typelist === []) {
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
                        defaultValue='选择文章分类'
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
                        onChange={e => setUpdateDate(Math.ceil(e._d.getTime() / 1000))}
                    />
                    <TextArea
                        className='introedit'
                        placeholder='简介编写'
                        showCount
                        allowClear
                        maxLength={350}
                        onChange={e => editintro(e)}
                    />
                    <div
                        className='introview'
                        style={{ marginBottom: 10 }}
                        dangerouslySetInnerHTML={{ __html: mdintro }}
                    >
                    </div>
                    <Button
                        type="primary"
                        icon={<VerticalAlignTopOutlined />}
                        size="large"
                        onClick={submitblog}
                    >
                        发布博客
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default Addpalt