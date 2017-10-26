import React from 'react'
import { BEIGIN_RECEIVE_USER } from '../action'

class Index extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() { 
        this.props.dispatch({
            type:'/get_todo'
        })
    }

    render() {
        const todoList = this.props.todoList
        return (
            <div>
                <h1 onClick={this.getUser.bind(this)}>todo-list</h1>
                <input type="text" ref="todo" />
                <button onClick={this.submit.bind(this)}>提交</button>
                <ul>
                    {
                        todoList.length
                            ?
                            todoList.map((item, index) => {
                                return (
                                    <li key={index}>
                                        {
                                            item.finish
                                                ?
                                                <span style={{textDecoration: 'line-through' }} onClick={this.finish.bind(this, item.id)}>{item.name}</span>
                                                :
                                                <span onClick={this.finish.bind(this, item.id)}>{item.name}</span>
                                        }
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <a href="javascript:;" onClick={this.delete.bind(this, item.id)}>删除</a>
                                    </li>
                                )
                            })
                            :
                            null
                    }
                </ul>
            </div>
        )
    }

    getUser() {
        //console.log(this.props)
        //this.props.dispatch(BEIGIN_RECEIVE_USER())
    }

    submit() {
        this.props.dispatch({
            type: '/add_todo',
            data: this.props.todoList,
            name:this.refs.todo.value
        })
    }

    finish(id) {
        this.props.dispatch({
            type: '/finish_todo',
            data: this.props.todoList,
            id
        })
    }

    delete(id) {
        this.props.dispatch({
            type: '/del_todo',
            data: this.props.todoList,
            id
        })
    }

}


export default Index