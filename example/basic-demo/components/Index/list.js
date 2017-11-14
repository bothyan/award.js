import React from 'react'
import { connect } from 'react-redux'
import Item from './item'

class List extends React.Component {

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

    render() {
        const todoList = this.props.todoList
        if (!!todoList === false || todoList.length === 0) { 
            return null
        }

        return (
            <div className="todolist-section">
                <ul className="todo-list">
                    {todoList.map(item => { 
                        return <Item
                            key={item.id}
                            data={item}
                            finish={this.finish.bind(this, item.id)}
                            delete={this.delete.bind(this, item.id)}
                        />
                    })}   
                </ul>  
            </div>    
        )
                
    }
    
}

export default connect(state => state || {})(List)