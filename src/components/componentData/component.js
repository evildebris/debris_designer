/**
 *    @class component 继承immutable中Map类组件数据对象，为消除大量页面数据操作内存消耗以及编辑器堆栈维护
 * 使用immutable对象。
 *  @constructor 传入拖拽图标是在页面的offset定位，以及对应的icon类型
 *
 **/

import Style from './style'
import Immutable from '../../immutableSrc/immutable';
import _ from '../../utils/utils'
let componentMap;

setTimeout(()=>{
    if(!componentMap){
        componentMap = require( '../componentMap').default; //所有组件映射最后请求，避免出现请求闭环
    }
});

function OwnerID() {};

function makeComponent(size, root, ownerID, hash){
    const component = Object.create(ComponentPrototype);
    component.size = size;
    component._root = root;
    component.__ownerID = ownerID;
    component.__hash = hash;
    component.__altered = false;
    return component;
}
class Component extends Immutable.Map{
    constructor(offset,icon){
        let style=new Style({
            left:offset.left,
            top:offset.top,
            position:'absolute',
            width:300,
            height:200
        }),_attrs = Immutable.Map({className:"component"});
        super({style,_attrs,children:Immutable.List([])});

        if(this.__proto__ !== Component.prototype) {
            this.__proto__ = Component.prototype;
        }
        this.icon = icon;
        this.id = _.guid();
        this.style = this.get("style");//方便代码操作
        this.children = this.get("children");//方便代码操作
    }
    /**
     * @method getNewCom 取得新的component对象属性引用不变
     * */
    getNewCom(){
        let newCom = makeComponent(this.size, this._root, new OwnerID(), this.__hash),methods;
        methods =Object.keys(this);
        methods.map(e=>{
            if(!newCom[e]){
                newCom[e] = this[e];
            }
        });
        return newCom;
    }
    copy(){//深拷贝
        let component = Object.create(Component.prototype),children=Immutable.List([]);
        component.size = this.size;
        component.__altered = false;
        component.id = _.guid();
        component.icon = this.icon;

        component = component.set('style',new Style(this.style.toObject()));
        component.style = component.get("style");
        component = component.set('_attrs',this.get("_attrs"));
        this.children.forEach((e,i)=>{
            children = children.push(e.copy());
        });
        component = component.set('children',children);
        component.children = children;

        return component;
    }
    toJSON() {
        let object = {};
        this.__iterate(function (v, k) {
            object[k] = v;
        });
        object.icon = this.icon;
        object.id = this.id;
        object.path = this.path;
        object.parentId = this.parentId;
        return object;
    }
    /**
     * @method 在每次修改Map对象时回调该方法
     * */
    recoveryData(prevData){
        if(prevData && prevData.constructor === Component) {
            this.icon = prevData.icon;
            this.id = prevData.id;
            this.path = prevData.path;
            this.parentId = prevData.parentId;
            this.style = this.get("style");
            this.children = this.get("children");
        }
    }
    set attrs(val){
        if(Immutable.Map.isMap(val)||_.isObject(val)) {
            this.set("_attrs", val);
        }
    }
    get attrs(){
        return this.get("_attrs").toObject();
    }
    commonStyle(){
        return {
            'box-sizing': 'border-box'
        }
    }
    getStyle(){
        return this.style.toObject();
    }
    /**
     * 去掉定位后的style属性编辑状态中用外部编辑框定位
     * */
    getNoPosStyle(){
        return this.style.getNoPosStyle();
    }
    /**
     * 获取定位后的style属性 外部编辑框定位
     * */
    getPosStyle(){
        return this.style.getPosStyle();
    }
    setStyle(_style){

    }
    /**
     * 获取该组件对应的REACTDOM的对象
     * */
    getReactComponent(){
        if(this.icon){
            let comName = this.icon[0].toUpperCase()+this.icon.slice(1),reactComponent=componentMap[comName];
            if(!reactComponent){
                throw new Error(`no find reactComponent named ${comName},make sure add ${comName} code`);
                //reactComponent = componentMap.ComponentBase;
            }
            return reactComponent;
        }
    }
}
const ComponentPrototype = Component.prototype;
Component.toComponent = function(comObj){
    if(_.isObject(comObj)&&comObj.constructor!== Component){
        let component = Object.create(Component.prototype),children=Immutable.List([]);
        component.size = comObj.size;
        component.__altered = false;
        component.id = comObj.id;
        component.icon = comObj.icon;
        component.path = comObj.path;

        component = component.set('style',new Style(comObj.style));
        component.style = component.get("style");
        component = component.set('_attrs',Immutable.Map(comObj._attrs));
        comObj.children.forEach((e,i)=>{
            if(_.isObject(e)) {
                children = children.push(Component.toComponent(e));
            }
        });
        component = component.set('children',children);
        component.children = children;

        return component;
    }
};
export default Component;