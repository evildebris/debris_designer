/**
 *    @class component 继承immutable中Map类组件数据对象，为消除大量页面数据操作内存消耗以及编辑器堆栈维护
 * 使用immutable对象。
 *  @constructor 传入拖拽图标是在页面的offset定位，以及对应的icon类型
 *
 **/

import Style from './style'
import Immutable from 'immutable';
import _ from '../../utils/utils'
import componentMap from '../componentMap'

export default class component extends Immutable.Map{
    constructor(offset,icon){
        let style=new Style({
            left:offset.left,
            top:offset.top,
            position:'absolute',
            width:300,
            height:200
        }),_attrs = Immutable.Map({className:"component"});
        super({style,_attrs});

        //需要重新添加原属性，被Map覆盖
        this.__proto__ = component.prototype;
        this.icon = icon;
        this.id = _.guid();
        this.style = this.get("style");//方便代码操作
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
                console.error(`no find reactComponent named ${comName},make sure add ${comName} code`);
                reactComponent = componentMap.ComponentBase;
            }
            return reactComponent;
        }
    }
}