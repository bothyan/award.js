
import './loading.scss'

export default class Loading extends React.Component { 

    constructor() { 
        super()
        this.state = {
            show:true
        }
    }

    onClick() { 
        this.setState({
            show:false
        })
    }

    render() { 

        if (!this.state.show) { 
            return null
        }

        return (
            <div styleName="loading" onClick={this.onClick.bind(this)}>
                <p>加载中</p>
            </div>
        )
    }
}