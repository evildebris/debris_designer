import Immutable from '../../immutableSrc/immutable';
import _ from '../../utils/utils'

const posStyle = ['left','top','right','bottom','margin','marginLeft','marginTOP','marginRight','marginBottom','position','zIndex'];
const comStyle = ['width','height'];
export default class Style extends Immutable.Map{
    constructor(_style){
        super(_style);
        if(this.__proto__ !== Style.prototype) {
            this.__proto__ = Style.prototype;
        }
        let instance = this;
        if(_style && typeof _.isObject(_style)){
            instance.styleKeys= Object.keys(_style);
            for(let name in _style){
                Object.defineProperty(this,name,{
                    get:function () {
                        return instance.get(name);
                    },
                    set:function (val) {
                        let newStyle = instance.set(name,val);
                        //回调的钩子为后期配置项需要留的接口
                        instance.styleChange && instance.styleChange.apply(instance,[name,val])
                        return newStyle;
                    }
                })
            }
        }else{
            instance._style = Immutable.Map({});
        }
    }
    recoveryData(prevData){
        if(prevData && prevData.constructor === Style) {
            let instance = this;
            if(prevData.styleKeys){
                this.styleKeys = prevData.styleKeys;
                prevData.styleKeys.map((name,i)=>{
                    Object.defineProperty(this,name,{
                        get:function () {
                            return instance.get(name);
                        },
                        set:function (val) {
                            let newStyle = instance.set(name,val);
                            //回调的钩子为后期配置项需要留的接口
                            instance.styleChange && instance.styleChange.apply(instance,[name,val]);
                            return newStyle;
                        }
                    })
                });
            }
        }
    }
    /**
     * 去掉定位后的style属性编辑状态中用外部编辑框定位
     * */
    getNoPosStyle(){
        let $$noPosStyle = this.toObject();
        posStyle.forEach((e,i)=>{
            if($$noPosStyle[e]!==undefined){
                delete $$noPosStyle[e];
            }
        });
        return $$noPosStyle;
    }
    /**
     * 获取定位后的style属性 外部编辑框定位
     * */
    getPosStyle(){
        let $$noPosStyle = this,style = {};
        posStyle.forEach((e,i)=>{
            if($$noPosStyle.get(e)){
                style[e] = $$noPosStyle.get(e);
            }
        });
        comStyle.forEach((e,i)=>{
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