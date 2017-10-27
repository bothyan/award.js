import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { withReduxSaga } from './store'
import { connect } from 'react-redux'
import { REFRESH } from './action'

import Index from './page/index'
import Detail from './page/detail'

const routers = [{
    path: '/',
    exact: true,
    Component: Index
}, {
    path: '/detail/:id',
    Component: Detail
}]


class AppContainer extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    {
                        routers.map((router, index) => (
                            <Route key={index}
                                exact={router.exact} 
                                path={router.path}
                                render={(props) => {

                                // 需要异步去获取数据
                                    
                                const Component = router.Component

                                if (!this.props.first) {
                                    Component.getInitialProps()
                                } else {
                                    this.props.first = false
                                }
                                    
                                return (
                                    <Component {...this.props} {...props} />
                                )
                            }} />
                        ))
                    }
                </Switch>
            </Router>
        )
    }

}

export default connect(state => state)(AppContainer)