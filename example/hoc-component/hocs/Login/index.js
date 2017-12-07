export default function (Component) { 

    class LoginHoc extends React.Component { 

        onClick() { 
            console.log('登录')
        }

        render() { 
            return (
                <div onClick={this.onClick.bind(this)}>  
                    <Component />
                </div>
            )    
        }
    }

    return LoginHoc
}