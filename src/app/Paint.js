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
    get4uid(){
        let now=new Date().getTime()+"";
        return now.substring(now.length-4);
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
        let instance = this,jsonData;

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
                /*case'a':{
                    jsonData = manage.getJsonData();
                    break;
                }
                case'r':{
                    manage.recoveryFromJsonData(JSON.parse(jsonData));
                    break;
                }*/
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
                        manage.setPlate();
                        break;
                    }
                }
                case 'v':{
                    if(e.ctrlKey){
                        let plateCom = manage.getPlate();
                        if(plateCom){
                            manage.add(plateCom.copy(),plateCom.parentId);
                        }
                        break;
                    }
                }
                default:
                    break;
            }
        });
    }
}
export default Paint