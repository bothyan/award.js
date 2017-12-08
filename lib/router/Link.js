import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { ResolveRouter,LinkPage } from './utils'

export default class Link extends React.Component {

    constructor(props) {
        super(props)
        this.linkPage = this.linkPage.bind(this)        
    }

    async linkPage(e) {
        await LinkPage.call(this,e)
    }

    render() {
        //如果没有指定tag 那么会拿取子节点的第一个元素作为tag,那么其上面的props会传递
        //如果指定了tag 那么就是在子节点包了一层tag信息
        let { children, to, tag } = this.props

        let props = {
            ...this.props,
            href: to,
            onClick: this.linkPage
        }, child

        delete props.to
        delete props.tag
        delete props.children
        delete props.loading

        if (tag) {
            //传了指定的tag
            return React.createElement(tag, props, children);
        } else {
            //默认会获取当前子节点的主元素
            if (typeof children === 'string') {
                return React.createElement('a', props, children);
            } else {
                child = React.Children.only(children)
                return React.cloneElement(child, props);
            }
        }

    }
}

Link.contextTypes = {
    AWARD_PROPS: PropTypes.object
}