import React from 'react'
import ReactDom from 'react-dom'

class Index extends React.Component { 
    constructor() { 
        super()
        this.state = {
            list:[{
                name:'123',
                finish:false
            }]
        }
    }
    render() { 
        return (
            <div>
                <h1>todo-list</h1>
                <input type="text" ref="todo"/>
                <button onClick={this.submit.bind(this)}>提交</button>
                <ul>
                    {
                        this.state.list.length
                        ?
                        this.state.list.map((item,index)=>{
                            return (
                                <li key={index}>
                                    {
                                        item.finish
                                        ?
                                        <span style={{'text-decoration':'line-through'}} onClick={this.finish.bind(this,index)}>{item.name}</span>
                                        :
                                        <span onClick={this.finish.bind(this,index)}>{item.name}</span>
                                    }
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <a href="javascript:;" onClick={this.delete.bind(this,index)}>删除</a>
                                </li>
                            )
                        })
                        :
                        null
                    }
                </ul>
            </div>
        )
    }

    submit(){
        const name = this.refs.todo.value
        let list = this.state.list
        list.unshift({name,finish:false})
        this.setState({list})
    }

    finish(finishIndex){
        let list = this.state.list
        list[finishIndex].finish = !list[finishIndex].finish
        this.setState({list})
    }

    delete(delIndex){
        const newState = []
        this.state.list.map((item,index)=>{
            if(index!==delIndex){
                newState.push(item)
            }
        })
        this.setState({
            list:newState
        })
    }
    
}

export default Index