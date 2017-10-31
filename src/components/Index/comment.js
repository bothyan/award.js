import React from 'react'
import { connect } from 'react-redux'
import './style/comment.scss'

class Comment extends React.Component {

    submit() {
        let text = this.commentInput.value;
        
        if (!text) return false;
        
        this.props.dispatch({
            type: '/add_todo',
            data: this.props.todoList,
            name: text
        })

        this.commentInput.value = '';
    }


    render() {
        return (
            <div className="comment-section pure-form">
                <textarea ref={el => this.commentInput = el}
                        name="comment-input"
                        id="comment-input"
                        placeholder="add todo"></textarea>
                <button onClick={this.submit.bind(this)} className="pure-button pure-button-primary">添加</button>
            </div>   
        )
                
    }
    
}

export default connect(state => state || {})(Comment)