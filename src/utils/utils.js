var _typeof = function(arg){
    return Object.prototype.toString.call(arg);
}

var isArray = function(arg){
    return _typeof(arg) === '[object Array]';
}

var isDate = function(arg){
    return _typeof(arg) === '[object Date]';
}

var isRegExp = function(arg){
    return _typeof(arg) === '[object RegExp]';
}

var isObject = function(arg){
    return _typeof(arg) === '[object Object]';
}

var isFunction = function(arg){
    return _typeof(arg) === '[object Function]';
}

var copy = function(source, destination, stackSource, stackDest) {

    if (!destination) {
        destination = source;
        if (source) {
            if (isArray(source)) {
                destination = copy(source, [], stackSource, stackDest);
            } else if (isDate(source)) {
                destination = new Date(source.getTime());
            } else if (isRegExp(source)) {
                destination = new RegExp(source.source,source.toString().match(/[^\/]*$/)[0]);
                destination.lastIndex = source.lastIndex;
            } else if (isObject(source)) {
                var emptyObject = Object.create(Object.getPrototypeOf(source));
                destination = copy(source, emptyObject, stackSource, stackDest);
            }
        }
    } else {
        if (source === destination)
            throw new Error("Can't copy! Source and destination are identical.");
        stackSource = stackSource || [];
        stackDest = stackDest || [];
        if (isObject(source)) {
            var index = stackSource.indexOf(source);
            if (index !== -1)
                return stackDest[index];
            stackSource.push(source);
            stackDest.push(destination);
        }
        var result;
        if (isArray(source)) {
            destination.length = 0;
            for (var i = 0; i < source.length; i++) {
                result = copy(source[i], null , stackSource, stackDest);
                if (isObject(source[i])) {
                    stackSource.push(source[i]);
                    stackDest.push(result);
                }
                destination.push(result);
            }
        } else {
            if (isArray(destination)) {
                destination.length = 0;
            } else {
                for(var key in destination){
                    delete destination[key];
                }
            }
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    result = copy(source[key], null , stackSource, stackDest);
                    if (isObject(source[key])) {
                        stackSource.push(source[key]);
                        stackDest.push(result);
                    }
                    destination[key] = result;
                }
            }
        }
    }
    return destination;
}

var getCode = function(){
    return (65536 * (1 + Math.random() ) | 0).toString(16).substring(1);
}

var offset = function (ele) {
    var top = ele.offsetTop;
    var left = ele.offsetLeft;
    while (ele.offsetParent) {
        ele = ele.offsetParent;
        if (window.navigator.userAgent.indexOf('MSTE 8') > -1) {
            top += ele.offsetTop;
            left += ele.offsetLeft;
        } else {
            top += ele.offsetTop + ele.clientTop;
            left += ele.offsetLeft + ele.clientLeft;
        }
    }
    return {
        left: left,
        top: top
    }

}

export default {
    isArray : isArray,

    isDate  : isDate,

    isRegExp : isRegExp,

    isObject : isObject,

    offset : offset,

    isFunction : isFunction,

    /**
     * 深度拷贝对象 包括 数组、日期、object、正则对象、function、基本类型
     **/
    copy : function(arg){
        return copy.call(this, arg);
    },

    /**
     * 原型对象
     **/
    typeof : function(arg){
        return _typeof.call(this, arg);
    },

    guid : function(){
        return getCode() + getCode() + '-' + getCode() + '-' + getCode() + '-' + getCode() + '-' + getCode() + getCode() + getCode();
    }
}