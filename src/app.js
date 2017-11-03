import React from 'react'
import { BrowserRouter as Router, Route, Switch , Prompt, Redirect } from 'react-router-dom'

import { withReduxSaga } from './store'
import { connect } from 'react-redux'

import Routes from '../routes'
//import './common/rem'
import './common/style/common.scss'

Routes.map(item => { 
    const Component  = require(`./page/${item.page}`)   
    item.Component = Component.default || Component
})

const InitiAlProps = (Component) => {
    class Initi extends React.Component {

        constructor() { 
            super()
            this.state = {}
        }

        render() {
            return <Component {...this.state} {...this.props}/>  
        }
    
        async componentDidMount() {
            if (React.load) {
                this.setState({ ...await Component.getInitialProps() })
            } else { 
                React.load = true
            }    
        }
    }

    return Initi
}    


class AppContainer extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    {
                        Routes.map((router, index) => {
                            return (
                                <Route key={index}
                                    exact={router.exact}
                                    path={router.path}
                                    component={(props) => { 
                                        return <div>{React.createElement(InitiAlProps(router.Component),{ ...this.props,...props })}</div>                                         
                                    }} />
                            )
                        })
                    }
                </Switch>
            </Router>
        )
    }

}

export default connect(state => state || {})(AppContainer)