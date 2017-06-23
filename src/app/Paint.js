import React, { Component } from 'react'
import server from '../utils/server'
import component from '../components/componentData/component'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

const manage = server.manage;

@immutableRenderDecorator
class Paint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            components:manage.$$components
        }
    }
    render(){
        let components=[];
        this.state.components.forEach((e,i)=>{
            let Component = e.getReactComponent();
            components.push(<Component component={e} key={e.id}>
            </Component>);
        });
        return (<div id="canvas">
            {components}
        </div>);
    }
    componentDidMount(){
        let instance = this;

        manage.setPaintUpdate((components)=>{
            components && this.setState({
                components
            })
        });

        server.on('listItem:drag_end', (offset,icon) => {
            manage.add(new component(offset,icon));
        });

        window.addEventListener && window.addEventListener('keyup',(e)=>{
            let components ;
            switch (e.key){
                case 'Delete':{
                    manage.remove();
                    break;
                }
                case 'z':{
                    if(e.ctrlKey){
                        manage.undo();
                        break;
                    }
                }
                case 'y':{
                    if(e.ctrlKey){
                        manage.redo();
                        break;
                    }
                }
                case 'c':{
                    if(e.ctrlKey){

                    }
                }
                default:
                    break;
            }
        });
    }
}
export default Paint