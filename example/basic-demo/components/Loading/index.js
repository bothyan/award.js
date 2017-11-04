import React from 'react'
import './style/index.scss'

export default class Loading extends React.Component {
  render() {
    return (
      <div className='loading'>
        <div className='indicator'>
          <div className='indicator-wrapper'>
            <span className='indicator-spin'>
              <div className='spinner-snake' />
            </span>
          </div>
        </div>
      </div>
    )
  }
}
