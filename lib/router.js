import React from 'react'


export class Router extends React.Component { 

    componentDidMount() { 
        console.log('router')
        window.addEventListener('popstate', () => { 
            console.log(1)
            window.history.replaceState(null,null,'/')
        })
    }

    render() { 
        return this.props.children
    }
}

export class Route extends React.Component { 
    
    render() { 
        const { path, render, children } = this.props

        if (typeof SWRN_ROUTE != 'undefined' && SWRN_ROUTE) { 
            return <swrn swrn_route={JSON.stringify(this.props)} />
        }
        
        if (typeof children === 'undefined') {
            return null
        }

        return <h1>hello world2</h1>
        
        return this.props.children
    }
}

export class Link extends React.Component {
    
    constructor(props) { 
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    onClick() { 
        window.history.replaceState(null, null, this.props.to)
       
        const obj = document.createElement('script')

        obj.src = `/swrn/bundles/page${this.props.to}/index.js`
        
        document.body.appendChild(obj)

    }

    render() { 

        let { children,to,tag } = this.props

        if (typeof children === 'string') {

            console.log(typeof tag)
        
            tag = tag || 'a'

            return React.createElement(tag, {
                onClick:this.onClick
            }, children);
        } 

        const props = {
            onClick:this.onClick
        }

        const child = React.Children.only(children)

        console.log(child)
       return React.cloneElement(child,props)
    }
}