import {
    FormOutlined,
    TableOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu,message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';


import './index.css'
const { Header, Content, Footer, Sider } = Layout;

const Admin = () => {
    const [collapsed, setCollapsed] = useState(true);//侧边栏折叠
    const navi = useNavigate()

    useEffect(() => {
        getauthinfo()
    },[])

    const getauthinfo = async () => {
        try {
            const res = await axios('/api/admin/index')
            if (res.data.code === 3) {
                //被后台路由守卫拦截
                message.error(res.data.data)
                return navi('/', { replace: true })
            }
        } catch (error) {
            return message.error('error')
        }
    }

    return (
        <Layout
            style={{ minHeight: '100vh' }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logoarea">YHnoZY</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['item-1']} >
                    <Menu.Item key="item-1" icon={<HomeOutlined />} onClick={() => navi('/admin')}>
                        主页
                    </Menu.Item>
                    <Menu.Item key="item-2" icon={<FormOutlined />} onClick={() => navi('addblog')}>
                        编辑博客
                    </Menu.Item>
                    <Menu.Item key="item-3" icon={<TableOutlined />} onClick={() => navi('blogtable')}>
                        博客列表
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{ padding: 0, height: '40px' }}
                />
                <Content style={{ margin: '0 16px', }}>
                    {/* 面包屑导航 */}
                    <Breadcrumb style={{ margin: '3px 0', }}>
                        <Breadcrumb.Item>Admin</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 10, height: '620px', minWidth: '1000px', overflow: 'auto'
                        }}
                    >
                        
                        {/* ----------------------------内容区---------------------------- */}
                        <Outlet />

                    </div>
                </Content>
                <Footer style={{ fontSize:'12px',textAlign: 'center', padding: "0 0 2px 0" }}>
                    Blog Admin v1.0
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Admin