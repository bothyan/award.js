import React from 'react'
import { isInServer, isHandleRouter, isEmptyObj } from '../utils'

export default class Route extends React.Component {
    render() {
        //处理路由配置，需要返回的消息
        if (isInServer() && isHandleRouter()) {
            return <award award_route={JSON.stringify(this.props)} />
        }
        //不处理直接返回
        return null
    }
}
