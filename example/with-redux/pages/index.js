
import React from 'react'
import { bindActionCreators } from 'redux'
import { Link } from 'award/router'
import { initStore, add } from '../store'
import withRedux from 'next-redux-wrapper'

class Index extends React.Component { 

    static async getInitialProps() {
        return {
            name: 'top'
        }
    }

    constructor() { 
        super()
        this.state = {
            new:false
        }
    }

    change() { 
        this.setState({
            new:!this.state.new
        })

        this.props.addCount()
    }

    render() { 
        return (
            <div>
            <h1 className="hello" onClick={this.change.bind(this)} style={{ color: this.state.new ? 'red' : 'black' }}>
                hello {this.props.name}      
                </h1>
                <span>redux变化{this.props.count}</span>    <br/>
                <Link to="/about/12/home/140" tag="span"><a>查看详情</a></Link>                  
            </div>    
        )
    }
}

const mapStateToProps = (state) => { 
    return {
        count:state.count
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      addCount: bindActionCreators(add, dispatch)
    }
  }

export default withRedux(initStore,mapStateToProps,mapDispatchToProps)(Index)