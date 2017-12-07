import React from 'react'
import IndexComponent from '../components/index'
import '../style/index.scss'
import '../style/about.scss'
import '../style/tmp.scss'

export default  class Index extends React.Component { 
    render() { 
        const className = 12
        const styleName = 13
        return (
            <div>
                <h1
                    styleName='name'
                    className="hello"
                >
                    hello world 
                    <span styleName="name" className="wode" className="hah">你好，世界</span>
                </h1>
                {className}{styleName}
                <IndexComponent />                
            </div>    
        )
    }
}