import React, { Component } from 'react'

class ComponentBase extends Component {
    constructor(props) {
        super(props);
        this.initComponent(props);
        this.state = {
            id:this.props.component.id,
            component:this.props.component
        }
    }
    getProps(){
        return {
            id:this.state.id,
            name: this.props.component.name,
            ...this.props.component.attrs,
            style:this.props.component.getNoPosStyle()
        };
    }
    template (){ // 棋板
        let props = this.getProps(), dom = React.createElement('div',props,this.props.children);
        return dom
    }
    initComponent(props){
        if(!props.component){
            console.error('component init error by constructor');
            return false;
        }
    }
    render(){
        let template = this.template();
        return template;
    }
    componentDidMount(){
        if(this.props.component.style.styleChange){
            /*this.props.component.style.styleChange = (name,val)=>{
                this.setState()
            }*/
        }
    }
}
export default ComponentBase