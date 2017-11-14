import React from 'react'
import { BrowserRouter as Router, Route, Switch , Prompt, Redirect } from 'react-router-dom'

//const Routes = require('./routes.js')
//const { Loading } = require('./document.js')

// Routes.map(item => { 
//     const Component  = require(`./page/${item.page}.js`)
//     item.Component = Component.default || Component
// })

const Routes = [{
    page:'home/index',
    path: '/',
    exact: true
}, {
    page:'home/detail',    
    path: '/detail/:id'
},{
    page:'list',    
    path: '/list',
    exact: true
},{
    page:'center/list',    
    path: '/center',
    exact: true
}]

const InitiAlProps = (Component) => {
    class Initi extends React.Component {

        constructor() { 
            super()
            this.state = {
                initDone: false,
                MineCommponet: {}
            }
        }

        render() {
            if (!this.state.initDone) {
                return <h1>加载中...</h1>
            } else {
                const Text = this.state.MineCommponet
                console.log(Text)
                return <Text {...this.state} {...this.props} />
            }    
        }
    
        async componentDidMount() {
            if (React.load) {
                this.setState({ ...await Component.getInitialProps() })
            } else { 
                React.load = true
            }
            // this.setState({
            //     initDone:true
            // })

            var obj = document.createElement("script")
            obj.setAttribute("src", "http://localhost:8001/index.js")
            document.body.append(obj)

            setTimeout(() => {
                var _Component = MineCommponet.default
                console.log(_Component)
                this.setState({
                    initDone: true,
                    MineCommponet:_Component
                })
            },1500)
        }
    }

    return Initi
}


class Test extends React.Component { 
    render() { 
        return null
    }
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
                                        let Component = router.Component
                                        Component = Test
                                        return <div>{React.createElement(InitiAlProps(Component),{ ...this.props,...props })}</div>                                         
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