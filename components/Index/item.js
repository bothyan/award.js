import React from 'react'
import { Link } from 'react-router-dom'

class Item extends React.Component {
    render() {
        const { data } = this.props
        const style = data.finish ? { textDecoration: 'line-through' } : {}
        return (
            <li>
                <span style={style} onClick={this.props.finish}>{data.name}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link to={`/detail/${data.id}`}><span>查看</span></Link>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="javascript:;" onClick={this.props.delete}>删除</a>
            </li>
        )
    }

}

export default Item