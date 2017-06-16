import React, { Component } from 'react'
import Immutable from 'immutable';
import server from '../utils/server'
import component from '../components/componentData/component'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class Paint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            components:props.components?props.components:Immutable.List([])
        }
    }
    render(){
        let components=[];
        this.state.components.forEach((e,i)=>{
            let Component = e.getReactComponent();
            components.push(<Component component={e} key={i}>
            </Component>);
        });
        return (<div id="canvas">
            {components}
        </div>);
    }
    componentDidMount(){
        let instance = this;
        server.on('listItem:drag_end', (offset,icon) => {
            let _components = instance.state.components.push(new component(offset,icon));
            instance.setState({
                components:_components
            })
        })
    }
}
export default Paint