export default class Error extends React.Component { 
    render() { 
        return (
            <div>
                <h1 className="error">错误页面,错误码：{this.props.error.statusCode}</h1>
                <p>{this.props.error.stack.k.l.m}</p>
            </div>    
        )
    }
}