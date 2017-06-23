import Immutable from '../immutableSrc/immutable';
import _ from '../utils/utils'

const maxHistory = 10;

export default class componentManage {
    constructor(components){
        if(components){
            let componentMap = {};
            components.map((e,i)=> {
                if (!componentMap[e.id]) {
                    componentMap[e.id] = e;
                }
            });
            this.$$componetMap = Immutable.Map(componentMap);  //fromJS 深拷贝转化成
            this.$$components = Immutable.List(components);
            this.history = [this.$$components];
            this.mapHistory = [this.$$componetMap];
            this.historyIndex = 0;
        }
    }
    getCurrentComponnets(){
        return this.$$components;
    }
    undo(){
        if(this.historyIndex){
            this.$$components = this.history[--this.historyIndex];
            this.$$componetMap = this.mapHistory[this.historyIndex];
            this.updatePaint && this.updatePaint();
            return this.$$components;
        }
        return null;
    }
    redo(){
        if(this.history.length-1>this.historyIndex){
            this.$$components = this.history[++this.historyIndex];
            this.$$componetMap = this.mapHistory[this.historyIndex];
            this.updatePaint && this.updatePaint();
            return this.$$components;
        }
        return null
    }
    updateComponentImmutable(){

    }
    /**
     *  @method _hasComponent 判断当前缓存中是否还有该组件,
     *  @param object/string 组件对象/组件ID
     * */
    _hasComponent(component){
        let id = _.isObject(component)?component.id:component;
        return this.$$componetMap.get(id);
    }
    _add(component,parentComponentId){
        if(component&&!this._hasComponent(component)){
            let parentComponent = this._hasComponent(parentComponentId);
            if(parentComponent) {
                if(!parentComponent.get("children")){
                    this._update(parentComponent.path+".children",Immutable.List([]));
                }
                component.parentId = parentComponent.id;
                component.path = parentComponent.path+".children."+parentComponent.children.size;
            }else {
                component.path = ''+ this.$$components.size;
            }
            this._update(component.path,component);
        }
    }
    _update(path,component){
        if(_.isObject(path)){
            component = path;
            path = this.$$components.size+'';
        }
        this.$$components = this.$$components.updateIn(path.split('.'),()=>{return component});
    }
    _delete(component){
        if(component&&this.$$componetMap.get(component.id)){
            let currentIndex;
            if(component.parentId){
                let parentCom = this.$$componetMap.get(component.parentId);
                parentCom.children.forEach((e,i)=>{
                    if(e === component){
                        currentIndex = i;
                    }else if(currentIndex!==undefined&&currentIndex<i){
                        let com = parentCom.children.get(i);
                        com.path = com.path.slice(0,-1) + --i;
                    }
                });
            }else{
                this.$$components.forEach((e,i)=>{
                    if(e === component){
                        currentIndex = i;
                    }else if(currentIndex!==undefined&&currentIndex<i){
                        let com = this.$$components.get(i);
                        com.path = com.path.slice(0,-1) + --i;
                    }
                });
            }
            this.$$components =this.$$components.deleteIn(component.path.split('.'));
            this.$$componetMap = this.$$componetMap.delete(component.id);
        }
    }
    /**
     *  @methods update 更新数据历史堆栈对应组件
     * */
    update(component,noUpdateHistory){
        if(!component||!this._hasComponent(component)){
            return false;
        }
        this._update(component.path,component);
        this.$$componetMap = this.$$componetMap.set(component.id,component);
        !noUpdateHistory && this.updateHistory();
        this.updatePaint && this.updatePaint();
        return this.$$components;
    }
    change(component,parentComponentId){
        if(!component){
            return;
        }

        //是否画布中存在该组件 存在删除没有就直接添加
        if(_.isArray(component)){
            component.forEach((e)=>{
                this._hasComponent(e) && this._delete(e);
                this._add(e,parentComponentId);
            });
        }else{
            this._hasComponent(component) && this._delete(component);
            this._add(component,parentComponentId);
        }

        this.$$componetMap = this.$$componetMap.set(component.id,component);
        this.updateHistory();
        this.updatePaint && this.updatePaint();
        return this.$$components;
    }
    remove(componentId){
        if(!componentId){
            componentId = this.currentId;
        }
        if(componentId){
            let com = this.$$componetMap.get(componentId);
            this._delete(com);
            this.updateHistory();
            this.updatePaint && this.updatePaint();
        }
        return this.$$components;
    }
    add(component,parentComponentId){
        if(!component || this.$$componetMap.get(component.id)){
            return;
        }
        this.change(component,parentComponentId);
        return this.$$components;
    }
    updateHistory(){
        this.historyIndex++;
        this.history.splice(this.historyIndex);
        this.history.push(this.$$components);
        this.mapHistory.splice(this.historyIndex);
        this.mapHistory.push(this.$$componetMap);
        if(this.historyIndex>maxHistory-1){
            this.historyIndex = maxHistory-1;
            this.history.shift();
            this.mapHistory.shift();
        }
    }
    setPaintUpdate(fn){
        if(_.isFunction(fn)){
            this.updatePaint = ()=>{
                fn(this.$$components);
            };
        }
    }
}