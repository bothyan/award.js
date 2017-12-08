import React from 'react'
import PropTypes from 'prop-types'
import { popstate } from './router/utils'

/**
 * 所有的组件都会从这个App组件进行向下分发
 * 同时在这里会进行一个全局事件的绑定
 */
export default class App extends React.Component {

    getChildContext() {
        let props = Object.assign({},this.props) 
        delete props.Main
        return {
            AWARD_PROPS: {
                ...props
            }
        }
    }

    //设置popstate事件
    componentDidMount() {
        if (!this.props.Component) {
            //项目没有用main.js指定路由，这里需要做一次浏览器前进回退的事件处理
            window.addEventListener('popstate', async (e) => {
                popstate.call(this,false)                
            })
        }    
    }

    //如果this.props 存在Component字段， 那么就是走的自定义路由，即项目中存在main.js
    render() {
        const { Main } = this.props
        return this.props.Component ? <Main /> : <Main {...this.props.data}/>        
    }
}

App.childContextTypes = {
    AWARD_PROPS: PropTypes.object
}