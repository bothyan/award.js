import React from 'react'
import { Link } from 'swrn/router'
//import './style/item.scss'

class Item extends React.Component {
    render() {
        const { data } = this.props
        const style = data.finish ? { textDecoration: 'line-through' } : {}
        return (
            <li className="todo-list-item">
                {data.finish ?
                    <del>
                        <p onClick={this.props.finish}>{data.name}</p>
                    </del>
                    :
                    <p onClick={this.props.finish}>{data.name}</p>
                }
                <div className="item-action">
                    <Link to={`/detail/${data.id}`}><span>查看</span></Link>
                    <button onClick={this.props.delete} className="pure-button">
                        <i className="iconfont icon-delete"></i>
                    </button>
                </div>    
            </li>
        )
    }

}

export default Item