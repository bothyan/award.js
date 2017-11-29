import React from 'react'
import {Link} from 'swrn/router'
import { withReduxSaga } from '../../store'
import { connect } from 'react-redux'

const getRemoteData = (store) => { 
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            store.dispatch({
                type:'/get_todo_detail'
            })
            resolve()
        },1500)
    })
}

class Detail extends React.Component {
    static async getInitialProps({ store }) { 
       await getRemoteData(store)
    }
    render() { 
        return (
            <Link to="/"><h1>{this.props.todoDetail}</h1></Link>  
        )
    }
}

export default withReduxSaga(connect(state=>state || {})(Detail))