import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Modal, message, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { marked } from 'marked'
import hljs from "highlight.js";
import './index.css'

const { confirm } = Modal;
const Blogtable = () => {
    const [blogdata, setblogdata] = useState([])
    const [showbloginfo, setblogshow] = useState(0)
    const [visible, setVisible] = useState(false);
    const navi = useNavigate()

    useEffect(() => {
        getblogdata()
    },[])

    // markdown render
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

    const getblogdata = async () => {
        try {
            const res = await axios('/api/admin/blogtable')
            if (res.data.code === 3) {
                //被后台路由守卫拦截
                message.error(res.data.data)
                return navi('/', { replace: true })
            }
            setblogdata(res.data.data)
        } catch (error) {
            return message.error('error')
        }
    }
    const columns = [
        {
            title: '博客ID',
            dataIndex: 'id',
            width: '8%'
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: '40%',
            ellipsis: true,
            render: (title, { id, intro }) => <><a onClick={() => getBlogInfo(id)}>{title}</a>
                <Modal
                    title={'标题：' + title}
                    visible={visible & showbloginfo === id}
                    onCancel={() => setVisible(false)}
                >
                    <p>介绍：</p>
                    {intro?<div
                        className='tableintroview'
                        dangerouslySetInnerHTML={{ __html: marked(intro) }}
                    ></div>:<p>未填写</p>}
                </Modal>
            </>,
        },
        {
            title: '类别',
            dataIndex: 'type',
            width: '10%'
        },
        {
            title: '发布时间',
            dataIndex: 'time',
            width: '18%'
        },
        {
            title: '浏览量',
            dataIndex: 'view',
            width: '7%'
        },
        {
            title: '操作',
            // key: 'action',
            // dataIndex: 'id',
            render: (_, { id }) => (
                <Space size="middle">
                    <Popconfirm
                        title="确认要修改这篇博客?"
                        onConfirm={() => editblog(id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <a href="#">修改</a>
                    </Popconfirm>
                    <Button size='small' onClick={() => showDeleteConfirm(id)} danger>
                        删除
                    </Button>
                </Space>
            ),
        }
    ];

    //获取文章提示
    const getBlogInfo = (id) => {
        setblogshow(id)
        setVisible(true)
    }

    //删除文章提示
    const showDeleteConfirm = (id) => {
        confirm({
            title: `是否要删除这篇博客${id}?`,
            icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
            content: '',
            okText: '确认删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteblog(id)//执行删除操作
            },
        });
    };

    //删除文章操作
    const deleteblog = async (id) => {
        const res = await axios({
            method: 'POST',
            url: '/api/admin/delblog',
            data: {
                blogid: id
            }
        })
        if (res.data.code === 0) {
            message.success('删除成功')
            getblogdata()//获取新数据
        }
        else message.success('删除失败')
    }

    //编辑文章操作
    const editblog = (id) => {
        message.success(`修改${id}`)
        navi('/admin/editblog', { state: { id } })
    }

    // without initstate without render
    if (blogdata === []) {
        return (
            <p>loading</p>
        )
    }

    return (
        <div>
            <Table rowKey={item => item.id} columns={columns} dataSource={blogdata} />
        </div>
    )
}

export default Blogtable