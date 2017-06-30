/**
 * *
 * 单态模式：server用于不同组件之间通信
 * i hate react
 */
import componentManage from '../components/componentManage';
const manage = new componentManage([]);
class Server{
    constructor() {
        if (!Server.created) {
            Server.instance = this;
            Server.created = true;
            Server.instance.manage = manage;
        }
        return Server.instance
    }
    on(eventList,callback) {
        let cache ,event ,list;
        if(!callback) return;
        eventList = eventList.split(/,/);
        cache = this._eventList || ( this._eventList = {});
        while((event = eventList.shift())){
            list = cache[event] || (cache[event] = []);
            list.push({
                f : callback
            })
        }
        return this;
    }
    off(evt,func) {
        if(!arguments.length) return;
        let event = arguments[0],cache = this._eventList;
        if(!cache || !cache[event]) return;
        if(!func ){ delete cache[event]; return;}
        let list = cache[event];
        for(let i = 0; i < list.length ; i ++){
            if(list[i].f === func ){
                list.splice(i,1)
            }
        }
    }
    emit() {
        if(!arguments.length) return;
        let event = arguments[0],param = Array.prototype.slice.call(arguments,1),cache = this._eventList,callback = arguments[1];
        if(!cache || !cache[event]) return;
        if(callback===Object.prototype.toString.call(callback)=== '[object Function]'){
            param = Array.prototype.slice.call(arguments,2);
        }else {
            callback =null;
        }
        let list = cache[event].slice();
        for(let i = 0 , len = list.length ; i< len ; i ++){
            if(callback){
                if(list[i].f ==callback){
                    list[i].f.apply(list[i].c || this, param);
                    return;
                }
            }else {
                list[i].f.apply(list[i].c || this, param);
            }
        }
    }
}

let server = new Server();
export default server