import React, { Component } from 'react'
import server from '../utils/server'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class PopUp extends Component {
    constructor(props){
        super(props);
        this.state={
            type:'new'
        }
        this.click = this.click.bind(this);
    }
    click(state){
        server.emit('list_tab:click',state);
    }
    getShadowList(){
        if(this.state.type==='new'){
            return (<div className="shadow_content">

            </div>)
        }
    }
    render() {
        return (
            <div className="shadow">
                {this.getShadowList()}
            </div>
        )
    }
    componentDidMount() {
    }
}
export default PopUp