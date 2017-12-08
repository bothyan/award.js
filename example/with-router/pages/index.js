
import React from 'react'
import { Link,Redirect } from 'award/router'
import '../style/index.scss'

export default class Index extends React.Component { 

    static async getInitialProps() {
        return {
            name: 'top'
        }
    }

    constructor() { 
        super()
        this.state = {
            new: false,
            jump:false
        }
    }

    change() { 
        this.setState({
            new:!this.state.new
        })
    }

    onClick() { 
        this.setState({
            jump:true
        })
    }

    render() { 
        const _Redirect =  this.state.jump ?  <Redirect to="/about/12/home/15" push/> : null
        return (
            <div>
           
            <h1 styleName="hello" onClick={this.change.bind(this)} style={{ color: this.state.new ? 'red' : 'black' }}>
                hello {this.props.name}      
            </h1>
                    
            <p>link点击跳转</p>    
                <Link to="/about/12/home/14" tag="a">
                    <div styleName="tag">
                        设置指定的tag元素
                        <span>1</span>
                        <p>2</p>
                    </div>
                </Link>  
                
                <hr/>

                <Link to="/about/12/home/14">
                    <div styleName="myElement">
                        当前祖先元素包裹
                        <span>1</span>
                        <p>2</p>
                    </div>
                </Link> 
                
                <hr />
                
                <Link to="/about/12/home/14" styleName="string">
                    纯字符串包裹
                </Link> 
                
                <hr />

                <Link to="/about/12/home/14">
                    <img styleName="name"src="http://s1.xmcdn.com/apk/yx/dazhuzhai/img/banner.jpg"/>
                </Link> 

                <hr />

            <p>点击事件触发跳转</p> 

                <span onClick={this.onClick.bind(this)}>点击跳转</span>    
                {_Redirect}
            </div>    
        )
    }
}