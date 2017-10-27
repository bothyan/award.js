import React from 'react';
import Index from '../page';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'
import { connect, Provider } from 'react-redux'
import configureStore from '../store'

const appContainer = document.getElementById('wrap')
const appObj = document.getElementById('data')
const appData = JSON.parse(appObj.getAttribute("data-state"))
appObj.remove()

const store = configureStore(appData)
const mapStateToProps = (state) => state

const App = connect(mapStateToProps)(Index)

ReactDOM.render(
    <AppContainer>
        <App store={store}/>
    </AppContainer>
    ,
    appContainer
)