import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { withReduxSaga } from './store'
import { connect } from 'react-redux'

import Routes from '../routes'
import './common/rem'
import './common/style/common.scss'

Routes.map(item => { 
    const Component = require(`./page/${item.page}`)
    item.Component = Component.default || Component
})

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
                                    render={(props) => {

                                        // 需要异步去获取数据                                    
                                        const Component = router.Component
                                
                                        console.log(this.props)
                                
                                        if (React.load) {
                                            const props = Component.getInitialProps()
                                            console.log(props)
                                        } else {
                                            React.load = true
                                        }
                                    
                                        return (
                                            <Component name="hello" {...this.props} {...props} />
                                        )
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