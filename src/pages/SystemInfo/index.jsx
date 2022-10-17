import { Divider, List } from 'antd';
import React from 'react';

const data = [
    '前后分离的博客项目，包含前端页面应用，数据接口中台应用，后台博客管理应用',
    '主要功能：博客列表渲染，markdown文档渲染，markdown文档导航，博客状态更新，博客上线，修改和删除',
    '博客前台应用：React + Next.js + Ant Design + axios + marked + markdown-navbar + highlight.js',
    '数据中台应用：egg.js + egg-mysql + egg-cors + session',
    '管理后台应用：React + create-react-app + react-router + axios + marked',
    '数据库：MySQL',
    '版本：v1.0',//开源版本更新较慢，网站部署的安全处理已省略
];

const systeminfo = () => {
    return (
        <div style={{margin:'0 70px'}}>
            <Divider orientation="left">项目介绍</Divider>
            <List
                style={{margin:'0 50px'}}
                bordered
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />
        </div>
    )
}
export default systeminfo