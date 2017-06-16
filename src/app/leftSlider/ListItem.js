import React, { Component } from 'react'
import _ from '../../utils/utils'
import server from '../../utils/server'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class ListItem extends Component {
    constructor(props){
        super(props);
    }
    mouseDown(iconItem,event){
        let offset = _.offset(event.target),
            icon=event._targetInst._currentElement.props.icon,
            param={
            offset,
            icon:iconItem
        };
        server.emit('listItem:drag_start',param);
    }
    render() {
        let {icons} = this.props;
        icons = icons.map((val,index)=>{
            return (
                <li className="list_item" key={'list_item_'+val.icon}>
                    <div className={"drag-item iconfont icon-"+val.icon} icon={val.icon} onMouseDown={this.mouseDown.bind(this,val)}></div>
                    <div className="icon_info">{val.name}</div>
                </li>
            )
        })
        return (
            <ul className="list_block">
                {icons}
            </ul>
        )
    }
}
export default ListItem