import React from 'react'
import { Link } from 'react-router-dom'
import { withReduxSaga } from '../../store'
import { connect } from 'react-redux'
import Comment from '../../components/Index/comment'
import List from '../../components/Index/list'

import './style/index.scss'

class Index extends React.Component {

    static async getInitialProps({ store,isServer }) {
        store.dispatch({
            type:'/get_todo'
        })
    }

    render() {
        return (
                <div>
                    <header>
                        <h1 className="title">
                            <Link to="/list">TodoList</Link>
                        </h1>
                    </header>
                    <Comment />
                    <List />
                </div>
        )
    }
}

export default withReduxSaga(connect(state => state || {})(Index))