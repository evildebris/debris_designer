# debris_designer
这是一个使用React Native为框架，[Immutable](https://github.com/facebook/immutable-js/)为组件数据结构的一个页面设计器。项目可以运行，功能只能看基础拖拽，该项目才启动3周每周周末我都会定期开发更新。
改项目的目的是为前端我自己开发方便设计页面开发，生成一套我需要的前端页面模板。

## 项目内容

### 文件结构
* App 文件夹里是页面元素
* components 文件夹是react组件对象、组件对象、以及组件管理对象、还有组件编辑属性装饰器
* utils 实现的事件管理以及常用方法的封装

### 主要模块
* src/components/componentData/component 继承Immutable.Map对象部分接口未重写完，还在读Immutable.js的源码 是组件数据源对象
* src/components/component/editDecorator 组件编辑装饰器，在扩展react组件时可编辑组件可以加上声明@editDecorator
* src/components/componentManage 实现整个画布的数据管理，包括回退、前进、增删该查，该模块还未写完

## 项目安装
   启动项目,项目打包使用的是gulp-webpack只是因为用惯了gulp，后期会改成rollup，原生webpack打包冗余代码较大。
```
npm install (--save-dev)
gulp
```
