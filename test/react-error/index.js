var React = require('react')
var ReactDOM = require('react-dom/server')

const Home = () => (
    <h1>{this.props.a.b}</h1>
)

const Error = (props) => (
    <h1>{props.a.b}</h1>
)

const Main = () => (
    <h1>hello world</h1>
)

doRender(Home)

let error = false

function doRender(Component){

    try {
        render(Home)
    } catch (err) {
        //console.log('错误1',err)
        if (!error) {
            error = true
            try {
                render(Error)
            } catch (_err) { 
                console.log(_err)
            }    
        }       
    }
}    

function render(Component) { 
    ReactDOM.renderToString(React.createElement(Component, {b:2}))
    ReactDOM.renderToString(React.createElement(Main))
}