import React, { Component } from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import Canvas from './Canvas'
import Nav from './Nav'
import PopUp from './PopUp'

@immutableRenderDecorator
class Page extends Component {
    constructor(props){
        super(props);
    }
    mouseUp(event){
    }
    render() {
        return (
            <div style={{width:'100%',height:'100%'}}>
                <Nav/>
                <Canvas/>
                <div id="dragCopyItem"></div>
                <PopUp/>
            </div>
        )
    }
    componentDidMount() {
    }
}
export default Page