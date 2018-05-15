/**
 *   editDecorator.js  组件的编辑装饰器，实现拖拽，缩放等编辑状态封装
 * **/
import React, { Component } from 'react'
import {findDOMNode} from 'react-dom'
import server from '../utils/server'
import _ from '../utils/utils'

const manage = server.manage;

export default function editDecorator(Target) {
    class editBox extends Component {
        constructor(props){
            super(props);
            this.state = {
                drag:false,
                n:0,
                active:true
            };
            this.style = this.props.component.style.getPosStyle();
            this.component = this.props.component;
            this.changePos = this.changePos.bind(this);
            this.boxMouseUp = this.boxMouseUp.bind(this);
            this.boxMouseMove = this.boxMouseMove.bind(this);
            this.boxMouseDown = this.boxMouseDown.bind(this);
            this.boxMouseOut = this.boxMouseOut.bind(this);
            this.borderMouseMove = this.borderMouseMove.bind(this);
            this.borderMouseUp = this.borderMouseUp.bind(this);

        }
        changePos(){
            this.setState({n:++this.state.n});
        }
        borderMouseDown(type,evt){
            if(evt.target.parentElement.className.indexOf("resizeBox")>-1) {
                evt.stopPropagation();
                this.move = true;
                this.x = evt.clientX;
                this.y = evt.clientY;
                this.type = type;
                server.emit('listItem:resize_start',type,{up:this.borderMouseUp,move:this.borderMouseMove});
                !this.state.active && this.setState({active:true});
                manage.currentId = this.component.id;
            }
        }
        borderMouseMove(evt){
            if(this.move) {
                let dx,dy,{style}=this;
                switch (this.type) {
                    case 'n': {
                        dy = evt.clientY - this.y;
                        if(dy<=style.height){
                            style.height -=dy;
                            style.top += dy;
                        }
                        break;
                    }
                    case 'e': {
                        dx = evt.clientX - this.x;
                        if(-dx<=style.width){
                            style.width +=dx;
                        }
                        break;
                    }
                    case 's': {
                        dy = this.y - evt.clientY;
                        if(dy<=style.height){
                            style.height -=dy;
                        }
                        break;
                    }
                    case 'w': {
                        dx = evt.clientX - this.x;
                        if(dx<=style.width){
                            style.width -=dx;
                            style.left += dx;
                        }
                        break;
                    }
                    case 'se': {
                        dx = this.x - evt.clientX;
                        dy = this.y - evt.clientY;
                        if(dx<=style.width&&dy<=style.height){
                            style.width -=dx;
                            style.height -=dy;
                        }
                        break;
                    }
                    default:
                        break;
                }
                manage.update(this.component.mergeIn(['style'],this.style),true);
                this.x = evt.clientX;
                this.y = evt.clientY;
            }
        }
        borderMouseUp(evt){
            this.move = false;
            this.type = "";
            manage.update(this.component.mergeIn(['style'],this.style));
        }
        getDropTarget(evt){
            let drops = document.querySelectorAll('#canvas .component'),currentZindex,target;
            drops.forEach((e,i)=>{
                if(e.parentElement === this.boxDom){
                    return;
                }
                let left = _.offset(e).left,top = _.offset(e).top;
                if(evt.clientX>left&&evt.clientX<left+e.offsetWidth&&evt.clientY>top&&evt.clientY<top+e.offsetHeight){
                    if(e.parentElement.style.zIndex!==""){
                        if(currentZindex === undefined){
                            currentZindex = ~~e.parentElement.style.zIndex;
                            target = e;
                        }else if(e.parentElement.style.zIndex - currentZindex>=0){
                            currentZindex = ~~e.parentElement.style.zIndex;
                            target = e;
                        }
                    }else if(currentZindex === undefined||currentZindex<0){
                        target = e;
                    }
                }
            });
            target && console.log(`${target.getAttribute('id')} can drop`);
        }
        boxMouseMove(evt){
            if(this.isMove){
                let _x = evt.clientX - this.x,_y = evt.clientY - this.y;
                this.style.left=this.startLeft + _x + this.boxParentDom.scrollLeft-this.parentScrollLeft;
                this.style.top=this.startTop + _y + this.boxParentDom.scrollTop-this.parentScrollTop;
                manage.update(this.component.mergeIn(['style'],this.style),true);
            }
        }
        boxMouseUp(evt){
            this.isMove = false;
            this.setState({drag:false});
            this.getDropTarget(evt);
            manage.update(this.component.mergeIn(['style'],this.style));
        }
        boxMouseDown(evt){
            if(!this.isMove){
                this.isMove = true;
                //记录初始信息
                this.x=evt.clientX;
                this.y=evt.clientY;
                this.parentScrollLeft = this.boxParentDom.scrollLeft;
                this.parentScrollTop = this.boxParentDom.scrollTop;
                this.startLeft = this.style.left;
                this.startTop = this.style.top;
                server.emit('listItem:box_start',{up:this.boxMouseUp,move:this.boxMouseMove,id:this.props.component.id});
                server.emit('listItem:clear_active',this.component.id);
                this.setState({drag:true,active:true});
                manage.currentId = this.component.id;
            }
        }
        boxMouseOut(){
            this.isMove = false;
            this.setState({drag:false});
        }
        render(){
            let posStyle = this.style;
            return (
                <div className={(this.state.drag?"resizeBox drag":"resizeBox")+(this.state.active?' active':'')} key={this.component.id+"_edit"} onMouseDown={this.boxMouseDown} style={{...posStyle}}>
                    <Target {...this.props} isDrag={this.state.drag}>
                        {this.props.children}
                    </Target>
                    <div className="n" onMouseDown={this.borderMouseDown.bind(this,'n')} style={{width:posStyle.width,left:0,top:- 2}}></div>
                    <div className="e" onMouseDown={this.borderMouseDown.bind(this,'e')} style={{height:posStyle.height,right:-2,top:0}} ></div>
                    <div className="s" onMouseDown={this.borderMouseDown.bind(this,'s')} style={{width:posStyle.width,left:0,bottom:-2}}></div>
                    <div className="w" onMouseDown={this.borderMouseDown.bind(this,'w')} style={{height:posStyle.height,left:- 2,top:0}}></div>
                    <div className="se" onMouseDown={this.borderMouseDown.bind(this,'se')} style={{right:-2,bottom:-2}}></div>
                </div>)
        }
        componentWillUpdate(nextProps,nextState,nextContent){
            this.style = nextProps.component.style.getPosStyle();
            this.component = nextProps.component;
        }
        componentDidMount(){
            this.boxDom = findDOMNode(this);
            this.boxParentDom =  this.boxDom.parentElement;

            server.emit('listItem:clear_active',this.component.id);
            manage.currentId = this.component.id;

            server.on('listItem:resize_move', this.borderMouseMove);
            server.on('listItem:resize_end', this.borderMouseUp);
            server.on('listItem:box_move', this.boxMouseMove);
            server.on('listItem:box_end', this.boxMouseUp);
            server.on('listItem:clear_active',this.clearActive =(currentActiveId)=>{
                if(currentActiveId === this.component.id){
                    return;
                }
                this.state.active && this.setState({active:false});
            });
        }
        componentWillUnmount(){
            server.off('listItem:resize_move', this.borderMouseMove);
            server.off('listItem:resize_end', this.borderMouseUp);
            server.off('listItem:box_move', this.boxMouseMove);
            server.off('listItem:box_end', this.boxMouseUp);
            server.off('listItem:clear_active',this.clearActive);
        }
    }
    return editBox;
}