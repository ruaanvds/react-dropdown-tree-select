import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Checkbox from '../checkbox'
import RadioButton from '../radio'

import styles from './index.css'

const cx = cn.bind(styles)

class NodeLabel extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    actions: PropTypes.array,
    title: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    partial: PropTypes.bool,
    disabled: PropTypes.bool,
    dataset: PropTypes.object,
    mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
    showPartiallySelected: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    readOnly: PropTypes.bool,
    clientId: PropTypes.string,
    searchInput: PropTypes.string,
    highlightSearch: PropTypes.bool,
  }

  handleCheckboxChange = e => {
    const { mode, id, onCheckboxChange } = this.props

    if (mode === 'simpleSelect' || mode === 'radioSelect') {
      onCheckboxChange(id, true)
    } else {
      const {
        target: { checked },
      } = e
      onCheckboxChange(id, checked)
    }
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  getHighlightedText(text, higlight) {
    const escapeRegExp = (str = '') => str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')

    let parts = text.split(new RegExp(`(${escapeRegExp(higlight)})`, 'i'))
    return (
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            style={part.toLowerCase() === higlight.toLowerCase() ? { fontWeight: 'bold', color: '#eb9110' } : {}}
          >
            {part}
          </span>
        ))}
      </span>
    )
  }
  render() {
    const { mode, title, label, id, partial, checked } = this.props
    const { value, disabled, showPartiallySelected, readOnly, clientId } = this.props
    const nodeLabelProps = { className: 'node-label' }

    // in case of simple select mode, there is no checkbox, so we need to handle the click via the node label
    // but not if the control is in readOnly or disabled state
    const shouldRegisterClickHandler = mode === 'simpleSelect' && !readOnly && !disabled

    if (shouldRegisterClickHandler) {
      nodeLabelProps.onClick = this.handleCheckboxChange
    }

    const sharedProps = { id, value, checked, disabled, readOnly, tabIndex: -1 }

    return (
      <label title={title || label} htmlFor={id}>
        {mode === 'radioSelect' ? (
          <RadioButton name={clientId} className="radio-item" onChange={this.handleCheckboxChange} {...sharedProps} />
        ) : (
          <Checkbox
            name={id}
            className={cx('checkbox-item', { 'simple-select': mode === 'simpleSelect' })}
            indeterminate={showPartiallySelected && partial}
            onChange={this.handleCheckboxChange}
            {...sharedProps}
          />
        )}
        <span {...nodeLabelProps}>
          {this.props.highlightSearch ? this.getHighlightedText(label, this.props.searchInput) : label}
        </span>
      </label>
    )
  }
}

export default NodeLabel
