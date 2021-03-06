import React from 'react'
import PropTypes from 'prop-types'
import { LinkPage } from './utils'

export default class Redirect extends React.Component { 
    async componentWillMount() { 
        await LinkPage.call(this)
    }

    render() { 
        return null
    }
}

Redirect.contextTypes = {
    AWARD_PROPS: PropTypes.object
}