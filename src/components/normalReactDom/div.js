import React, { Component } from 'react'
import ComponentBase from '../componentBase'
import editDecorator from '../editDecorator'
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator @editDecorator
class Div extends ComponentBase {
    constructor(props) {
        super(props);
    }
}
export default Div