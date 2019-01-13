import React from "react";
import BetterScroll from "better-scroll";
import Bubble from "./bubble";
import Loading from "./loading";
import {mergeOptions} from "../contanst/scroll"
import { getRect } from "../util";
import "./style.scss"
class Scroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pullDownInitTop: -50,
      beforePullDown: true, // 拉下来之前
      isRebounding: false, // 是否反弹
      isPullingDown: false, // 是否下拉
      isPullUpLoad: false, // 是否上拉
      pullUpDirty: true, // 判断是否加载到数据
      pullDownStyle:-50,
      bubbleY:0,
      pullUpText:"",
      pullDownText:""
    };
    this.scroll=null;
    this.options=null;
    this._initialScroll= this._initialScroll.bind(this);
    this._initScrollEvent = this._initScrollEvent.bind(this)
  }
  componentDidMount() {
    this._initialScroll();
    this._initScrollEvent();
  }
  _initialScroll() {
    if (!this._scroll) return;
    this.options = mergeOptions(this.props.options);
    this._scrollChild.style.minHeight = getRect(this._scroll).height + 1 + "px";
    this.scroll = new BetterScroll(this._scroll,this.options);
  }
  _initScrollEvent() {
    this.scroll.on("pullingDown", () => {
      this.setState(() => ({
        beforePullDown: false,
        isPullingDown: true
      }));
      this.props.pullingDown();
    });
    this.scroll.on("pullingUp", () => {
      this.setState({
        isPullUpLoad: true
      },()=>{this.props.pullingUp()});
    });
    this.scroll.on("scroll", pos => {
      if (this.state.beforePullDown) {
        this.setState({
          bubbleY: Math.max(0, pos.y + this.state.pullDownInitTop),
          pullDownStyle: Math.min(pos.y + this.state.pullDownInitTop, 10)
        });
      } else {
        this.setState({ bubbleY: 0 });
      }
      if (this.state.isRebounding) {
        this.setState({
          pullDownStyle: 10 - (this.options.pullDownRefresh.stop - pos.y)
        });
      }
    });
  }
  _reboundPullDown() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setState(() => ({ isRebounding: true }));
        this.scroll.finishPullDown(); // 当下拉刷新数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载
        resolve();
      }, 600);
    });
  }
  _afterPullDown() {
    setTimeout(() => {
      this.setState(() => ({
        pullDownStyle: this.state.pullDownInitTop,
        beforePullDown: true,
        isRebounding: false
      }));
      this.refresh();
    }, 800);
  }
  refresh() {
    // 刷新
    this.scroll && this.scroll.refresh();
  }
  onChildUpdate(flag) {
    console.log(flag)
    this.forceUpdate(flag);
  }
  forceUpdate(dirty) {
    if (this.state.isPullingDown) {
      this.state.isPullingDown = false;
      this._reboundPullDown().then(() => {
        this._afterPullDown();
      });
    }
    if (this.state.isPullUpLoad) {
      this.setState({ pullUpDirty: dirty ,isPullUpLoad:false},()=>{
        this.pullUpText();
        this.scroll.finishPullUp();
        this.refresh();
      });
    }
  }
  pullUpText() {
    let text = this.state.pullUpDirty ? "加载更多" : "没有更多的数据";
    this.setState({
      pullUpText :  text
    });
  }
  render() {
    return (
      <div
        //通过这个节点来初始化第一个子节点为BetterScroll
        className="scroll-wrap"
        ref={sw => {
          this._scroll = sw;
        }}
      >
        <div className="scroll-container-wrap">
          <div
            //这个子节点主要来设置最小高度为父高度
            className="scroll-list-wrap"
            ref={s => {
              this._scrollChild = s;
            }}
          >
            {this.props.children()}
          </div>
          <div className="pullUp-wrap">
            <div className="loading-wrap">
              {this.state.isPullUpLoad ? (
                <Loading />
              ) : (
                this.state.pullUpText
              )}
            </div>
          </div>
        </div>
        <div
          className="pulldown-wrap"
          style={{ top: this.state.pullDownStyle + "px" }}
        >
          <div className="loading-wrap">
            {this.state.isPullingDown && <Loading />}
            {!this.state.beforePullDown && !this.state.isPullingDown && (
              <div>已刷新数据</div>
            )}
          </div>
          {this.state.beforePullDown && <Bubble y={this.state.bubbleY} />}
        </div>
      </div>
    );
  }
}
export default  Scroll