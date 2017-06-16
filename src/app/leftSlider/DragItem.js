import React, { Component } from 'react'
import _ from '../../utils/utils'
import server from '../../utils/server'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class DragItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentIcon : {},
            isShow:false,
            offset:{
                left:0,
                top:0
            }
        }
    }
    mouseMove(event){
        if(this.state.isShow) {
            let offset = {
                left:event.clientX - 22,
                top:event.clientY - 28
            }
            this.setState({offset});
        }
    }
    render() {
        let currentIcon = this.state.currentIcon;
        return (
             <div className="list_item drag_item" style={{display:this.state.isShow?'block':'none',left:this.state.offset.left,top:this.state.offset.top-35}}>
                 <div className={"drag-item iconfont icon-"+currentIcon.icon} icon={currentIcon.icon}></div>
                 <div className="icon_info">{currentIcon.name}</div>
             </div>
        )
    }
    componentDidMount(){
        let instance = this;
        server.on('listItem:drag_start',(param)=>{
            this.setState({
                isShow:true,
                currentIcon:param.icon,
                offset:param.offset
            })
        })
        server.on('listItem:drag_move',(offset)=>{
            this.setState({
                offset:offset
            })
        })
        server.on('listItem:drag_end2',(offset)=>{
            this.setState({
                isShow:false
            })
        })
    }
}
export default DragItem