import { Checkbox } from 'antd';
import React from 'react';




/***--- roleModuleList.js表格中 渲染此组件 ---**/
class RoleCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      isChecked: this.props.defaultChecked,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultChecked !== nextProps.defaultChecked) {
      this.setState({
        isChecked: nextProps.defaultChecked,
      });
    }
  }

  // #region 收缩业务代码功能

  onChange(e) {
    const item = this.props.checkItem;
    this.setState({
      isChecked: e.target.checked,
    });
    this.props.onChecked(item, e.target.checked);
  }

  // #endregion


  // 操作左侧：未开通/已开通
  render() {
    return (
      <Checkbox
        checked={this.state.isChecked}
        onChange={this.onChange}
        disabled={this.props.checkItem.resName === '工作台'}
      >
        {this.state.isChecked ? '已开通' : '未开通'}
      </Checkbox>
    );
  }
}
export default RoleCheckbox;
