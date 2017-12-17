import React from 'react'
import ansiHTML from 'ansi-html'

export default ({ error, error: { name, message, module } }) => (
  <div style={styles.errorDebug}>
    {module ? <h1 style={styles.heading}>Error in {module.rawRequest}</h1> : null}
    {
      name === 'ModuleBuildError'
      ? <pre style={styles.stack} dangerouslySetInnerHTML={{ __html: ansiHTML(encodeHtml(message)) }} />
      : <StackTrace error={error} />
    }
  </div>
)

const StackTrace = ({ error: { name, message, stack = message } }) => (
  <div>
    <div style={styles.heading}>{message || name}</div>
    <pre style={styles.stack}>
      {stack}
    </pre>
  </div>
)

const styles = {
  errorDebug: {
    background: '#0e0d0d',
    boxSizing: 'border-box',
    overflow: 'auto',
    padding: '24px',
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999
  },

  stack: {
    fontFamily: '"SF Mono", "Roboto Mono", "Fira Mono", consolas, menlo-regular, monospace',
    fontSize: '13px',
    lineHeight: '18px',
    color: '#b3adac',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    marginTop: '16px'
  },

  heading: {
    fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    fontSize: '20px',
    fontWeight: '400',
    lineHeight: '28px',
    color: '#fff',
    marginBottom: '0px',
    marginTop: '0px'
  }
}

const encodeHtml = str => {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

ansiHTML.setColors({
  reset: ['6F6767', '0e0d0d'],
  darkgrey: '6F6767',
  yellow: '6F6767',
  green: 'ebe7e5',
  magenta: 'ebe7e5',
  blue: 'ebe7e5',
  cyan: 'ebe7e5',
  red: 'ff001f'
})
