import { Component, STATE, ATTRIBUTES, createElement } from '../framework.js'

class List extends Component {
    constructor() {
        super();
    }

    render() {
        this.children = this[ATTRIBUTES].data.map(this.template);
        this.root = (<div>{ this.children }</div>).render();
        return this.root;
    }

    appendChild(child) {
        this.template = child;
    }
}

export default List;
