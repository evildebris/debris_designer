import React, { Component } from 'react'
import server from '../utils/server'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class Nav extends Component {
    constructor(props){
        super(props);
        this.state={
            deleteComponentId:[]
        }
        this.click = this.click.bind(this);
    }
    click(state){
        server.emit('list_tab:click',state);
    }
    render() {
        return (
            <div className="nav" id="nav">
                <div className="leftMenu">
                    <a href="#" onClick={this.click('new')}>新建</a>
                    <a href="#" onClick={this.click('open')}>打开</a>
                    <a href="#" onClick={this.click('delete')}>删除</a>
                </div>
                <div></div>
            </div>
        )
    }
    componentDidMount() {
    }
}
export default Nav