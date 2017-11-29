import React from 'react'
import { withReduxSaga } from '../../store'
import { connect } from 'react-redux'
import Comment from '../../components/Index/comment'
import List from '../../components/Index/list'

//import './style/index.scss'

class Index extends React.Component {

    static async getInitialProps({ store, isServer }) {
        store.dispatch({
            type:'/get_todo'
        })
    }

    render() {
        return (
                <div className="content">
                    <header>
                        <h1 className="title">
                            TodoList
                        </h1>
                    </header>
                    <Comment />
                    <List />
                </div>
        )
    }
}

export default withReduxSaga(connect(state => state || {})(Index))