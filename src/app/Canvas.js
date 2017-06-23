import React, { Component } from 'react'
import server from '../utils/server'
import List from './leftSlider/List'
import DragItem from './leftSlider/DragItem'
import Paint from './Paint'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class Canvas extends Component {
    constructor(props){
        super(props);
        this.state={
            deleteComponentId:[]
        }
    }
    mouseMove(event){
        if(this.isMove) {
            let offset = {
                left:event.clientX - 22,
                top:event.clientY - 28
            }
            server.emit('listItem:drag_move',offset)
        }
        let param = {
            clientX:event.clientX,
            clientY:event.clientY
        };
        if(this.move){

            if(this.resizeEvents){
                this.resizeEvents.move(param);
            }else {
                server.emit('listItem:resize_move',param)
            }
        }
        if(this.boxMove){
            if(this.boxEvents){
                this.boxEvents.move(param);
            }else {
                server.emit('listItem:box_move',param)
            }
        }
    }
    mouseUp(event){
        if(this.isMove) {
            let offset = {
                left:event.clientX - 200,
                top:event.clientY - 35
            };
            let canvas = document.querySelector('#canvas'),canvasW = canvas.offsetWidth,canvasH = canvas.offsetHeight,isDrop=false;
            if( canvasW>=offset.left && offset.left>=0 && canvasH>=offset.top&&offset.top>=0 ){
                server.emit('listItem:drag_end',offset,this.currentIcon)
            }
            server.emit('listItem:drag_end2');
            this.isMove = false;
            this.currentIcon = null
        }
        let param = {
            clientX:event.clientX,
            clientY:event.clientY
        };
        if(this.move){
            if(this.resizeEvents){
                this.resizeEvents.up(param);
            }else {
                server.emit('listItem:resize_end',param)
            }
            this.move = false;
        }
        if(this.boxMove){
            if(this.boxEvents){
                this.boxEvents.up(param);
            }else {
                server.emit('listItem:box_up',param)
            }
            this.boxMove = false;
        }
    }
    render() {
        return (
            <div className="content" onMouseMove={this.mouseMove.bind(this)} onMouseUp={this.mouseUp.bind(this)}>
                <div id="drag_list" className="left_content">
                    <List></List>
                </div>
                <div id="paint" className="canvas">
                    <Paint id="canvas" deleteComponent={this.state.deleteComponentId}></Paint>
                </div>
                <div id="attrEditor"></div>
                <DragItem />
            </div>
        )
    }
    componentDidMount() {
        let canvas = document.getElementById('canvas');
        server.on('listItem:drag_start', (param) => {
            this.isMove = true;
            this.currentIcon = param.icon.icon;
        })
        server.on('listItem:resize_start', (type,resizeEvents) => {
            this.move = true;
            resizeEvents && (this.resizeEvents=resizeEvents);
        })
        server.on('listItem:box_start', (boxEvents) => {
            this.boxMove = true;
            boxEvents && (this.boxEvents=boxEvents);
        })
    }
}
export default Canvas