import Immutable from '../immutableSrc/immutable';
import _ from '../utils/utils'

const maxHistory = 10;

export default class {
    constructor(components){
        if(_.isArray(components)){
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
            return this.history[--this.historyIndex];
        }
        return null;
    }
    redo(){
        if(this.history.length-1>this.historyIndex){
            return this.history[++this.historyIndex];
        }
        return null
    }
    add(component,parentComponentId){
        if(!component || this.$$componetMap.get(component.id)){
            return;
        }
        let parentComponent;
        if(parentComponentId){
            parentComponent = this.$$componetMap.get(parentComponentId);
            if(!parentComponent.children){
                parentComponent.children = Immutable.List([]);
            }
        }
        if(_.isArray(component)){
            if(parentComponent) {
                component.forEach((e)=>{
                    e.parentId = parentComponent.id;
                });
                parentComponent.children = parentComponent.children.push(...component);
            }else {
                this.$$components = parentComponent.push(...component);
            }
        }else {
            if(parentComponent) {
                component.parentId = parentComponent.id;
                parentComponent.children = parentComponent.children.push(component);
            }else {
                this.$$components = this.$$components.push(component);
            }
        }
        this.$$componetMap = this.$$componetMap.set(component.id,component);
        this.history.push(this.$$components);
        this.historyIndex++;
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
        if(component&&this._hasComponent(component)){
            let parentComponent = this._hasComponent(parentComponentId);
            if(parentComponent) {
                if(!parentComponent.get("children")){
                    parentComponent.set("children",Immutable.List([]));
                }
                component.parentId = parentComponent.id;
                parentComponent.set("children",parentComponent.children.push(component));
            }else {
                this.$$components = this.$$components.push(component);
            }
        }
    }
    _delete(component){
        if(component&&this.$$componetMap.get(component.id)){
            if(component.parentId){
                let parentCom = this.$$componetMap.get(component.parentId);
                parentCom.children.forEach((e,i)=>{
                    if(e === component){
                        parentCom.children = parentCom.children.delete(i);
                        return false;
                    }
                });
            }else{
                this.$$components.forEach((e,i)=>{
                    if(e === component){
                        this.$$components = this.$$components.delete(i);
                        return false;
                    }
                });
            }

            this.$$componetMap = this.$$componetMap.delete(component.id);
        }
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
    }
    remove(componentId){
        if(componentId){
            let com = this.$$componetMap.get(componentId);
            this._delete(com);
            this.updateHistory();
        }
    }
    updateHistory(){
        this.history.push(this.$$components);
        this.historyIndex++;
        this.mapHistory.push(this.$$componetMap);
        if(this.historyIndex>9){
            this.historyIndex = 9;
            this.history.shift();
            this.mapHistory.shift();
        }
    }
}