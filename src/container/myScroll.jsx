import React from "react";
import Scroll from "../scroll/scroll";
import "./style.scss";
class MyScroll extends React.Component {
  constructor() {
    super();
    this.state = {
      list: ["我爱晶晶姑娘!", "我爱晶晶姑娘!"]
    };
    this.renderList = this.renderList.bind(this);
    this.onPullingDown = this.onPullingDown.bind(this);
    this.onPullingUp = this.onPullingUp.bind(this);
    this.onChildUpdate = this.onChildUpdate.bind(this);
  }
  onPullingDown() {
    // 模拟更新数据
    console.log("pulling down and load data");
    setTimeout(() => {
      if (Math.random() > 0.5) {
        this.setState({
          list: [...this.state.list, "我爱晶晶姑娘" + +new Date()]
        });
        this.onChildUpdate(true);
      } else {
        this.onChildUpdate();
      }
    }, 3000);
  }
  onChildUpdate(flag) {
    this.refs.getScroll.onChildUpdate(flag);
  }
  onPullingUp() {
    console.log("pulling up and load data");
    setTimeout(() => {
      if (Math.random() > 0.5) {
        this.setState({
          list: [...this.state.list, "我爱晶晶姑娘" + +new Date()]
        });
        this.onChildUpdate(true);
      } else {
        this.onChildUpdate();
      }
    }, 2000);
  }
  renderList() {
    return (
      <ul>
        {this.state.list
          ? this.state.list.map(item => {
              return <li>{item}</li>;
            })
          : null}
      </ul>
    );
  }
  render() {
    return (
      <div className="order-list-wrap">
        <Scroll
          ref="getScroll"
          pullingDown={this.onPullingDown}
          pullingUp={this.onPullingUp}
        >
          {this.renderList}
        </Scroll>
      </div>
    );
  }
}
export default MyScroll