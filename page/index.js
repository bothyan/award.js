import React from 'react'
import { BEIGIN_RECEIVE_USER } from '../action'
import axios from 'axios'
import { withReduxSaga } from '../store'
import { connect } from 'react-redux'
import List from '../components/Index/list'
import {BrowserRouter as Router,StaticRouter} from 'react-router-dom'

class Index extends React.Component {

    static async getInitialProps({ store,isServer }) {
        store.dispatch({
            type:'/get_todo'
        })
    }

    render() {
        return (
                <div>
                    <h1 onClick={this.getList.bind(this)}>TODO-LIST</h1>
                    <input type="text" ref="todo" />
                    <button onClick={this.submit.bind(this)}>提交</button>
                    <List />
                </div>
        )
    }

    getList() {
        this.props.dispatch({
            type:'/get_todo'
        })
    }

    submit() {
        this.props.dispatch({
            type: '/add_todo',
            data: this.props.todoList,
            name:this.refs.todo.value
        })
    }

}

export default withReduxSaga(connect(state=>state)(Index))