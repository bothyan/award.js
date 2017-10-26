import React from 'react';
import Index from '../page';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux'
import configureStore from '../store'

const appContainer = document.getElementById('wrap')

const store = configureStore({todoList:[]})
const mapStateToProps = (state) => state

const App = connect(mapStateToProps)(Index)

ReactDOM.render(
    
        <App store={store}/>    
   
    ,
    appContainer
)