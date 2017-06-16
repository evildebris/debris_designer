import React, { Component } from 'react'
import server from '../utils/server'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class DragListItem extends Component {
    constructor(props){
        super(props);
        this.state={
            isShow:false,
            icon:'',
            name:''
        };
    }
    render() {
        let {icons} = this.props;
        icons = icons.map((val,index)=>{
            return (
                <div className="drag_item" name={this.state.name} style={
                    {
                        position:'fixed',
                        display:this.state.isShow?'block':'none',
                        left:this.state.left,
                        top:this.state.top
                    }}>
                    <div className={"drag-item iconfont icon-"+this.state.icon}></div>
                    <div className="icon_info">{this.state.name}</div>
                </div>
            )
        })
        return (
            <ul className="list_block">
                {icons}
            </ul>
        )
    }
}
export default DragListItem