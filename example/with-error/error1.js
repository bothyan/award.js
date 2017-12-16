
import './style/error.scss'

export default class Error extends React.Component { 
    render() { 
        return (
            <div>
                <h1 styleName="error">错误页面,错误码：{this.props.error.code}</h1>
                <p>{this.props.error.stack}</p>
            </div>    
        )
    }
}