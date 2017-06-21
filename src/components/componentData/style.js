import Immutable from '../../immutableSrc/immutable';
import _ from '../../utils/utils'

const posStyle = ['left','top','right','bottom','margin','marginLeft','marginTOP','marginRight','marginBottom','position','zIndex'];

export default class style {
    constructor(_style){
        let instance = this;
        if(_style && typeof _.isObject(_style)){
            instance._style = Immutable.Map(_style);
            for(let name in _style){
                Object.defineProperty(this,name,{
                    get:function () {
                        return instance._style.get(name);
                    },
                    set:function (val) {
                        instance._style = instance._style.set(name,val);
                        //回调的钩子为后期配置项需要留的接口
                        instance.styleChange && instance.styleChange.apply(instance,[name,val])
                    }
                })
            }
        }else{
            instance._style = Immutable.Map({});
        }
    }
    toObject(){
        return this._style.toObject();
    }
    /**
     * 去掉定位后的style属性编辑状态中用外部编辑框定位
     * */
    getNoPosStyle(){
        let $$noPosStyle = this._style;
        posStyle.forEach((e,i)=>{
            if($$noPosStyle.get(e)){
                $$noPosStyle = $$noPosStyle.delete(e);
            }
        });
        return $$noPosStyle.toObject();
    }
    /**
     * 获取定位后的style属性 外部编辑框定位
     * */
    getPosStyle(){
        let $$noPosStyle = this._style,style = {};
        posStyle.forEach((e,i)=>{
            if($$noPosStyle.get(e)){
                style[e] = $$noPosStyle.get(e);
            }
        });
        return style;
    }
    addStyle(name,val){
        let instance = this;
        if(this.hasOwnProperty(name)){
            return;
        }
        Object.defineProperty(this,name,{
            get:function () {
                return instance._style.get(name);
            },
            set:function (val) {
                instance._style = instance._style.set(name,val);
                instance.styleChange && instance.styleChange.apply(instance,[name,val])
            }
        });
        if(val){
            instance[name] = val;
        }
    }
    styleChange(){
    }
}