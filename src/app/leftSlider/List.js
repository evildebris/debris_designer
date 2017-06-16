import React, { Component } from 'react'
import ListItem from './ListItem'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class List extends Component {
    constructor(props){
        super(props);
        this.state = {
            list:[{
                name:'布局',
                icon:[{icon:'row',name:'行布局'},{icon:'column',name:'列布局'}]
            },{
                name:'原型元素',
                icon:[{icon:'div',name:'div'},{icon:'link',name:'超链接'},{icon:'pieChart',name:'扇形图'}]
            }]
        }
    }
    render() {
        let childrens = this.state.list.map((val,i)=>{
            return (
                <li key={'list_'+val.name+i} style={{width:'100%',marginTop:i?'20px':'0'}}>
                    <div className="list_title">{val.name}</div>
                    <ListItem  icons={val.icon}>
                    </ListItem>
                </li>
            )
        })
        return (
            <ul>
                {childrens}
            </ul>
        )
    }
}
export default List