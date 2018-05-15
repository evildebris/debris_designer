import React, { Component } from 'react'
import _ from '../../utils/utils'
import server from '../../utils/server'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import CodeMirror from 'CodeMirror'
import hint from 'codemirror/addon/hint/show-hint'
import css from 'codemirror/addon/hint/css-hint'

@immutableRenderDecorator
class RightSlider extends Component {
    constructor(props){
        super(props);
        this.clickSlider = this.clickSlider.bind(this);
        this.state={
            active:true,
            btnClass:"icon-slider",
            dom:{
                active:false
            },
            attr:{
                active:false
            },
            style:{
                active:true
            },
        }
    }
    mouseUp(){
        server.emit('listItem:drag_start',param);
    }
    getInitData(){
        return {
            dom:{
                active:false
            },
            attr:{
                active:false
            },
            style:{
                active:false
            }
        }
    }
    clickLi(type){
        let data = this.getInitData();
        data[type].active = true;
        this.setState(data);
    }
    clickSlider(){
        let btnClass = "icon-slider";
        if(this.state.active){
            btnClass ="icon-open";
        }
        this.setState({active:!this.state.active,btnClass});
    }
    render() {
        return (
            <div id="rightSlider" className={this.state.active?"open":"close"}>
                <div className={`iconfont sliderBtn ${this.state.btnClass}`} onClick={this.clickSlider}></div>
                <ul className="tabList">
                    <li className={this.state.style.active?"active":""} onClick={this.clickLi.bind(this,"style")}>Style</li>
                    <li className={this.state.attr.active?"active":""}  onClick={this.clickLi.bind(this,"attr")}>属性</li>
                    <li className={this.state.dom.active?"active":""} onClick={this.clickLi.bind(this,"dom")}>DOM树</li>
                </ul>
                <div  className="styleBlock">
                    <textarea ref="style" name="style" id="style" ></textarea>
                </div>
            </div>
        )
    }
    componentDidMount (){
        if(!this.style){
            this.style = CodeMirror.fromTextArea(this.refs.style, {
                extraKeys: {"Ctrl-Space": "autocomplete"},
                "theme":"darcula",
                lineNumbers: true,
                styleActiveLine: true,
                matchBrackets: true
            });
        }
    }
}
export default RightSlider