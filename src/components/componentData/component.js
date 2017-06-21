/**
 *    @class component 继承immutable中Map类组件数据对象，为消除大量页面数据操作内存消耗以及编辑器堆栈维护
 * 使用immutable对象。
 *  @constructor 传入拖拽图标是在页面的offset定位，以及对应的icon类型
 *
 **/

import Style from './style'
import Immutable from '../../immutableSrc/immutable';
import _ from '../../utils/utils'
import componentMap from '../componentMap'

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
        super({style,_attrs});

        if(this.__proto__ !== Component.prototype) {
            this.__proto__ = Component.prototype;
        }
        this.icon = icon;
        this.id = _.guid();
        this.style = this.get("style");//方便代码操作
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
    /**
     * @method 在每次修改Map对象时回调该方法
     * */
    recoveryData(prevData){
        if(prevData && prevData.constructor === Component) {
            this.icon = prevData.icon;
            this.id = prevData.id;
            this.style = this.get("style");
        }
    }
    __ensureOwner(ownerID){
        if (ownerID === this.__ownerID) {
            return this;
        }
        if (!ownerID) {
            this.__ownerID = ownerID;
            this.__altered = false;
            return this;
        }
        return makeComponent(this.size, this._root, ownerID, this.__hash);
    }
    set attrs(val){
        if(Immutable.Map.isMap(val)) {
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
export default Component;