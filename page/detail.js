import React from 'react'
import {Link} from 'react-router-dom'
import { withReduxSaga } from '../store'
import { connect } from 'react-redux'

class Detail extends React.Component {
    static async getInitialProps({ store }) { 
        store.dispatch({
            type:'/get_todo_detail'
        })
    }
    render() { 
        return (
            <Link to="/"><h1>{this.props.todoDetail}</h1></Link>  
        )
    }
}

export default withReduxSaga(connect(state=>state)(Detail))