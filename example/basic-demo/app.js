import React from 'react'
import { BrowserRouter as Router, Route, Switch , Prompt, Redirect } from 'react-router-dom'

const { join,relative } = require('path')
const dir = process.env.dir

const Routes = require('./routes.js')
const { Loading } = require('./document.js')

Routes.map(item => { 
    const Component  = require(`./page/${item.page}.js`)
    item.Component = Component.default || Component
})

const InitiAlProps = (Component) => {
    class Initi extends React.Component {

        constructor() { 
            super()
            this.state = {
                initDone:false
            }
        }

        render() {
            if (!this.state.initDone) { 
                return <Loading/>
            }
            return <Component {...this.state} {...this.props}/>  
        }
    
        async componentDidMount() {
            if (React.load) {
                this.setState({ ...await Component.getInitialProps() })
            } else { 
                React.load = true
            }
            this.setState({
                initDone:true
            })
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
                                        require
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

export default AppContainer