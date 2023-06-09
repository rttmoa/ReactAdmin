import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin,  Button,  Popconfirm,  Form,  Input,  Layout,  Radio,  Icon,  message } from "antd";
import TableList from "@tableList";
// import { hashHistory } from 'react-router'
import { menu } from "@apis/common";
import {
  fetchRoleList,
  fetchRoleDetail,
  fetchRoleDelete,
  fetchModuleListInRole,
  // fetchRloeRes,
  fetchUpdateRoleRes,
  fetchUserList,
  fetchRoleDeletePeople,
  fetchUpdateButton,
  fetchTreeList,
} from "@apis/manage";
import RolesList from "./roleList";
import RolesModule from "./roleModuleList";
import PeopleTree from "./peopleTreeList";
import RoleEditModal from "./modal/roleAdd";
import ButtonModal from "./modal/buttonModal"; // 按钮权限列表
const FormItem = Form.Item;
const { Content, Sider } = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;








// 连接公用常量、后端返回的数据方法  并放置在props里面调用
@connect((state, props) => ({ config: state.config }))
@Form.create({})
export default class app extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "stepTree", // 角色树/模块选择/列表 切换
      Visible: false, // 显示 添加/编辑角色
      title: "",
      type: "",
      currRoleId: "",
      modifyId: "",
      // isReload: true,
      spinloading: true,
      tabsloading: false,  // 角色数表格加载状态
      tableLoading: false, // 模块选择表格加载状态
      treeloading: false,  // 列表表格加载状态
      searchKey: {
        roleName: "",
      },
      peopleSearchKey: {
        pageNo: 1,
        pageSize: 10,
      },
      pid: "",
      itemId: "",
      buttonVisible: false,
      checkedIdArr: {},
      btnRights: {
        add: true,
        edit: true,
        deleteRole: true,
        deletePolice: true,
      }, // 按钮权限的数组
      treeData: [],
      roleType: "",
      roleListResult: { list: [], loading: false },
      roleDetailManagResult: { list: [], loading: false },
      roleModuleListInRoleResult: { list: [], loading: false },
      // rloeResResult: { list: [], loading: false },
      rolePeopleResult: { list: [], loading: false },
    };
    this.resultCkecked = "";
  }
  // 组件即将加载
  componentWillMount() {
    // this.getBtnRights()
  }
  // 组件已经加载到dom中
  componentDidMount() {
    this.getData("init");
  }





  // #region 收缩业务代码功能

  // 发送获取当前菜单的按钮权限
  getBtnRights() {
  //   const { fetchBtns } = require('@configs/common')
  //   fetchBtns(this, btnRights => this.setState({ btnRights }))
  }

  /**
   * @description 角色树/模块选择/列表 切换
   * @param {*} e 
   */
  changeTab = (e) => {
    if (e.target.value === "stepTree") {
      this.getTreeList();
    } else if (e.target.value === "setmodules") {
      this.getRoleList();
    } else if (e.target.value === "setpeoples") {
      this.getPeopleList();
    }
    this.setState({ activeTab: e.target.value });
  };

  /**
   * @description 获取用户列表数据
   * @param {*} state 
   */
  getData(state) {
    this.setState({ spinloading: true },() => {
        fetchRoleList({ ...this.state.searchKey }, (result) => {
          this.setState({
              spinloading: false,
              roleListResult: result.data,
            }, () => {
              if (state === "init") {
                if (this.state.roleListResult.list.length >= 1) {
                  const roleId = this.state.roleListResult.list[0].id || -1;
                  this.state.currRoleId = roleId;
                  const { type } = result.data.list[0];
                  this.state.roleType = type;
                  if (this.state.activeTab === "stepTree") {
                    this.getTreeList();
                  } else if (this.state.activeTab === "setmodules") {
                    this.getRoleList();
                  } else if (this.state.activeTab === "setpeoples") {
                    this.getPeopleList();
                  }
                }
              }
            }
          );
        });
      }
    );
  }

  // 获取当前用户的详情
  getRoleDetail() {
    this.setState({ tabsloading: true }, () => {
      fetchRoleDetail(
        { id: this.state.currRoleId },
        (res) => {
          this.resultCkecked = res.data.resourceIds || [];
          this.setState({
            tabsloading: false,
            roleDetailManagResult: res.data,
          });
        },
        (res) => {
          message.warning(res.msg);
          this.setState({ tabsloading: false });
        }
      );
    });
  }

  /**
   * @description 获取角色树 / 3
   */
  getTreeList() {
    this.setState({ treeloading: true }, () => {
      fetchTreeList({ id: this.state.currRoleId },(res) => {
          this.state.checkedIdArr = {};
          res.data && res.data.list.map((data) => {
              this.hangdleButton(data);
            });
          this.setState({ treeloading: false, treeData: res.data.list });
        },(res) => {
          message.warning(res.msg);
          this.setState({ treeloading: false, treeData: [] });
        }
      );
    });
  }

  /**
   * @description 获取模块数据 / 3
   */
  getRoleList() {
    fetchModuleListInRole({ id: this.state.currRoleId }, (res) => {
      this.state.checkedIdArr = {};
      this.setState({ roleModuleListInRoleResult: res.data });
      const { list } = res.data;
      list.map((data) => {
        this.hangdleButton(data);
      });
      this.getRoleDetail();
    });
  }

  // 处理全部的按钮权限操作
  hangdleButton(data) {
    const checkedArr = [];
    const checkedIdAll = [];

    const buttonsList = data.buttons;
    if (buttonsList && buttonsList.length > 0) {
      buttonsList.map((item) => {
        checkedArr.push(item.resName);
        checkedIdAll.push(item.id);
      });
      data.checkedArr = checkedArr.join(",");
      this.state.checkedIdArr[data.id] = checkedIdAll;
    } else {
      data.checkedArr = "";
    }
    if (data.children && data.children.length > 0) {
      const { children } = data;
      children.map((child) => {
        this.hangdleButton(child);
      });
    }
  }

  /**
   * @description 获取列表数据 / 3
   */
  getPeopleList() {
    this.setState({ tableLoading: true }, () => {
      fetchUserList({ ...this.state.peopleSearchKey, roleId: this.state.currRoleId }, (res) => {
          this.setState({ tableLoading: false, rolePeopleResult: res.data });
        }
      );
    });
  }

  /**
   * @description 点击角色Name后执行的操作 发请求获取每个权限相应的功能
   * @param {*} id 
   * @param {*} type 
   */
  handleCurrentIndex = (id, type) => {
    this.setState({
        currRoleId: id,
        roleType: type,
        peopleSearchKey: {
          ...this.state.peopleSearchKey,
          pageNo: 1,
        },
      },() => {
        if (this.state.activeTab === "stepTree") {
          this.getTreeList();
        } else if (this.state.activeTab === "setmodules") {
          this.getRoleList();
        } else if (this.state.activeTab === "setpeoples") {
          this.getPeopleList();
        }
      }
    );
  };

  // 修改开通的checkbox值
  handleCheckModify = (values) => {
    this.resultCkecked = values;
  };

  /**
   * @description 模块选择+修改保存
   */
  editSave = () => {
    fetchUpdateRoleRes({ id: this.state.currRoleId, resourceIds: this.resultCkecked }, (res) => {
        if (res.status === 1) {
          message.success(res.msg);
          menu({}, (response) => {
            sessionStorage.setItem("menu", JSON.stringify(response.data.list));
            // hashHistory.push('/set$/roleManage')
            // location.reload()
          });
        }
      }
    );
  };

  /***--- 侧边栏加号 -- 角色添加 ---**/
  roleAdd = () => { this.setState({ Visible: true, title: "新增角色", type: "add" }) };

  /**
   * @description 角色修改时执行的操作 根据id发请求 成功后设置state的值
   * @param {*} id 
   */
  onRoleModify = (id) => {
    fetchRoleDetail({ id: id }, (result) => {
      this.setState({
        Visible: true,
        title: "修改角色",
        type: "modify",
        modifyId: id,
        roleDetailManagResult: result.data,
      });
    });
  };

  /**
   * @description 角色删除事件
   */
  handleRoleDelete = (id) => {
    fetchRoleDelete({ id: id }, (result) => {
      message.success(result.msg);
      this.getData("init"); 
    });
  };

 
  /**
    * @description 侧边栏搜索框 -- 角色搜索
    */
  handleRoleSearch(value) {
    this.setState({
        searchKey: {
          roleName: value,
        },
      },() => {
        this.getData();
      }
    );
  }

  // 删除人
  handleDelete = (id) => {
    fetchRoleDeletePeople(
      { id: id, roleId: this.state.currRoleId },
      (result) => {
        message.success(result.msg);
        this.getPeopleList(this.state.currRoleId);
      }
    );
  };

  /**
   * @description 列表+搜索
   * @param {*} e 
   */
  handleSearch = (e) => {
    e.stopPropagation();
    const keyword = this.props.form.getFieldValue("key");
    this.setState({
        peopleSearchKey: {
          ...this.state.peopleSearchKey,
          keyword: keyword,
        },
      }, () => {
        this.getPeopleList(this.state.currRoleId);
      }
    );
  };

  /***--- form 表单保存后调用 添加/编辑角色 ---**/
  handleOk = () => {
    this.setState({ Visible: false });
    fetchRoleList({}, (result) => {
      this.setState({
          spinloading: false,
          roleListResult: result.data,
        },() => {
          if (this.state.roleListResult.list.length >= 1) {
            const roleId = this.state.roleListResult.list[0].id || -1;
            this.state.currRoleId = roleId;
            const { type } = result.data.list[0];
            this.state.roleType = type;
            if (this.state.activeTab === "stepTree") {
              this.getTreeList();
            } else if (this.state.activeTab === "setmodules") {
              this.getRoleList();
            } else if (this.state.activeTab === "setpeoples") {
              this.getPeopleList();
            }
          }
        }
      );
    });
  };

  /***--- Modal 角色添加/编辑取消 ---**/
  handleCancel = () => {this.setState({ Visible: false });};

  // 页数改变
  pageChange = (newPage) => {
    this.setState({
        peopleSearchKey: {
          ...this.state.peopleSearchKey,
          pageNo: newPage,
        },
      },() => {
        this.getPeopleList(this.state.currRoleId);
      }
    );
  };

  // 页大小改变事件
  pageSizeChange = (e, pageSize) => {
    this.setState(
      {
        peopleSearchKey: {
          ...this.state.peopleSearchKey,
          pageNo: 1,
          pageSize: pageSize,
        },
      },
      () => {
        this.getPeopleList(this.state.currRoleId);
      }
    );
  };

  // 显示按钮权限列表
  buttonList = (id, parentid) => {
    this.setState({
      buttonVisible: true,
      pid: parentid,
      itemId: id,
      title: "模块按钮权限列表",
    });
  };

  /***--- 权限按钮 取消 ---**/
  cancelButton = () => {this.setState({buttonVisible: false,})};

  /***--- 权限按钮 保存更改 ---**/
  saveChecked = (selectedRowKeys) => {
    fetchUpdateButton({
        id: this.state.currRoleId,
        resourceIds: selectedRowKeys,
        menuId: this.state.itemId,
      }, (res) => {
        message.success(res.msg);
        this.getRoleList();
        this.cancelButton();
      }
    );
  };

  // 表格展示项的配置
  renderColumn() {
    const { btnRights } = this.state;
    const configArr = [
      {
        title: "姓名",
        dataIndex: "chineseName",
        key: "chineseName",
        width: 200,
      },
      {
        title: "单位",
        dataIndex: "deptName",
        key: "deptName",
        width: 200,
      },
      {
        title: "职务",
        dataIndex: "post",
        key: "post",
        width: 200,
      },
      {
        title: "账号",
        dataIndex: "username",
        key: "username",
        width: 150,
      },
      {
        title: "操作",
        key: "operate",
        width: 100,
        render: (text, record, index) =>
          btnRights.deletePolice ? (
            <span className="blue">
              <Popconfirm
                title="删除?"
                placement="left"
                onConfirm={() => this.handleDelete(record.id)}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          ) : null,
      },
    ];
    if (sessionStorage.getItem("roleName") !== "0") {
      // configArr.splice(4, 1)
    }
    return configArr;
  }

  /**
   * @description 角色树/模块选择/列表 点击内容 渲染哪部分数据
   * @param {*} key 
   * @returns 
   */
  returnContent(key) {
    if (key === "setmodules") {
      const { roleModuleListInRoleResult } = this.state;
      return (
        <Spin spinning={this.state.tabsloading}>
          <RolesModule
            dataSource={roleModuleListInRoleResult.list}
            loading={roleModuleListInRoleResult.loading}
            checkedId={this.resultCkecked}
            onCheckModify={this.handleCheckModify}
            roleType={this.state.roleType}
            buttonList={this.buttonList}
          />
        </Spin>
      );
    } else if (key === "setpeoples") {
      const { rolePeopleResult } = this.state;
      return (
        <div className="has-pagination table-flex flexcolumn">
          <Spin spinning={this.state.tableLoading}>
            <TableList
              rowKey="id"
              columns={this.renderColumn()}
              dataSource={rolePeopleResult.list}
              loading={rolePeopleResult.loading}
              currentPage={this.state.peopleSearchKey.pageNo}
              pageSize={this.state.peopleSearchKey.pageSize}
              scroll={{ y: true }}
              onChange={this.pageChange}
              onShowSizeChange={this.pageSizeChange}
              totalCount={rolePeopleResult.totalCount || 0}
            />
          </Spin>
          <div className="page-footer" />
        </div>
      );
    }
    if (key === "stepTree") { // 角色树
      return (
        <Spin spinning={this.state.treeloading}>
          <PeopleTree dataSource={this.state.treeData} />
        </Spin>
      );
    }
    return null;
  }

  // #endregion









  render() {
    const { roleDetailManagResult, roleListResult, activeTab } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { btnRights } = this.state;
    return (
      <div className="page page-scrollfix page-usermanage page-rolemanage">
        <Layout>
          <Layout className="page-body">

            {/* 左侧侧边栏区域 */}
            <Sider width={240} style={{ display: "flex", flexDirection: "column" }}>
              <Spin spinning={this.state.spinloading}>
                <FormItem>
                  <Search
                    style={{ width: "100%" }}
                    placeholder="搜索角色"
                    onSearch={(value) => this.handleRoleSearch(value)}
                    addonAfter={btnRights.add ? <Icon type="plus" title="新增角色" onClick={this.roleAdd}/> : null}
                  />
                </FormItem>
                <div className="treeside">
                  {/* 左侧侧边栏 - 角色信息 */}
                  <RolesList
                    roles={roleListResult.list || []}
                    handleRoleDelete={this.handleRoleDelete} // 角色删除事件
                    onRoleModify={this.onRoleModify}  // 角色修改时执行的操作
                    onCurrentIndex={this.handleCurrentIndex} // 点击角色Name后执行的操作
                    btnRights={btnRights}
                    // currRoleId={this.state.currRoleId}
                  />
                </div>
              </Spin>
            </Sider>

            {/* 右侧内容区域 */}
            <Content>
              <div className="page-header">
                <div className="layout-between">
                  <div className="left">
                    <Button
                      type="primary"
                      className={activeTab === "setpeoples" || activeTab === "stepTree" ? "hide" : null}
                      onClick={this.editSave}
                    >
                      保存
                    </Button>
                    <div className={activeTab === "setpeoples" ? "page-search" : "hide"}>
                      <Form className="flexrow">
                        <FormItem>
                          {getFieldDecorator("key")(
                            <Input
                              className="input-base-width"
                              size="default"
                              placeholder="请输入关键字进行搜索"
                            />
                          )}
                        </FormItem>
                        <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                      </Form>
                    </div>
                  </div>
                  <div className="right">
                    <RadioGroup onChange={this.changeTab} defaultValue="stepTree">
                      <RadioButton value="stepTree">角色树</RadioButton>
                      <RadioButton value="setmodules">模块选择</RadioButton>
                      <RadioButton value="setpeoples">列表</RadioButton>
                      {/* {sessionStorage.getItem('roleName') === '0' ? <RadioButton value="setmodules">模块选择</RadioButton> : null} */}
                      {/* {sessionStorage.getItem('roleName') === '0' ? <RadioButton value="setpeoples">列表</RadioButton> : null} */}
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <div className="page-content table-flex table-scrollfix">
                {this.returnContent(this.state.activeTab)}
              </div>
            </Content>

          </Layout>
        </Layout>
        {/* 左侧 -> 添加/编辑角色 弹出框 */}
        {this.state.Visible ? (
          <RoleEditModal
            visible={this.state.Visible}
            title={this.state.title}
            onCancel={this.handleCancel}
            handleOk={this.handleOk}
            value={this.state.type === "modify" ? roleDetailManagResult : { name: "", sort: "" }}
            type={this.state.type}
            modifyId={this.state.modifyId}
          />
        ) : null}
        {/* 右侧 -> 模块选择  -> 操作 -> 权限按钮 */}
        {this.state.buttonVisible ? (
          <ButtonModal
            title="按钮权限列表"
            visible={this.state.buttonVisible}
            pid={this.state.pid}
            itemId={this.state.itemId}
            cancelButton={this.cancelButton}
            saveChecked={this.saveChecked}
            checkedIdArr={this.state.checkedIdArr}
          />
        ) : null}
      </div>
    );
  }
}
