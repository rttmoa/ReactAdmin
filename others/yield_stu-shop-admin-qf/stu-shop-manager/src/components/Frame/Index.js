import React from "react";
import { withRouter } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Icon, Dropdown, Avatar, message, Badge } from "antd";
import { connect } from "react-redux";
import logo from "./logo.png";
import { adminRoutes } from "../../routes";
import "./frame.css";
import { clearToken } from "../../utils/auth";
const { Header, Content, Sider } = Layout;


const routes = adminRoutes.filter(route => route.isShow);  // 侧边栏isShow为true才显示Menu



function Index(props) {
  // console.log(props);

  // 下拉组件
  const popMenu = (
    <Menu onClick={p => {
        if (p.key == "logOut") {
          clearToken();
          props.history.push("/login");
        } else {
          if ((p.key == "noti")) {
            props.history.push("/admin/notices");
          }
        }
      }}
    >
      <Menu.Item key="noti">通知中心</Menu.Item>
      <Menu.Item key="setting">设置</Menu.Item>
      <Menu.Item key="logOut">退出</Menu.Item>
    </Menu>
  );

  return (
    <Layout>

      {/* 头部 */}
      <Header className="header" style={{backgroundColor: "#428bca"}}>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h3>Header</h3>
        <Dropdown overlay={popMenu}>
          <div>
            <Avatar>U</Avatar>
            <Badge dot={!props.notice.isAllRead}>
              <span style={{ color: "#fff" }}>超级管理员</span>
            </Badge>
            <Icon type="down" />
          </div>
        </Dropdown>
      </Header>

      {/* 侧边栏 */}
      <Layout>
        <Sider width={200} style={{ background: "#fff" }}>
          <h3>Menu - Menu.Item</h3>
          <Menu
            mode="inline"
            defaultSelectedKeys={[props.location.pathname]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0,  }}
          >
            {routes.map(route => {
              return (
                <Menu.Item key={route.path} onClick={p => props.history.push(p.key)}>
                  <Icon type={route.icon} />
                  {route.title}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>

        {/* 主体内容 */}
        <Layout style={{ padding: "16px" }}>
          <h3>此项目：使用Hooks和redux简易版， 封装{"<FrameLayout />"}组件包裹{"props.children"} + {"<Route render=>{routeProps => return <route.component ...routeProps />} />"}</h3>
          <h3>检查元素：查看页面由哪些板块组成</h3>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{background: "#fff", margin: 0, minHeight: 280}}>
            <h3>props.children</h3>
            {props.children}
          </Content>
        </Layout>

      </Layout>
    </Layout>
  );
}
export default connect(state => state, null)(withRouter(Index));
