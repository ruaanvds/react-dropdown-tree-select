import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Tag from '../tag'
import styles from './index.css'
import { getDataset, debounce } from '../utils'
import { getAriaLabel } from '../a11y'

const cx = cn.bind(styles)

const getTags = (tags = [], onDelete, readOnly, disabled, labelRemove) =>
  tags.map(tag => {
    const { _id, label, tagClassName, dataset } = tag
    return (
      <li className={cx('tag-item', tagClassName)} key={`tag-item-${_id}`} {...getDataset(dataset)}>
        <Tag
          label={label}
          id={_id}
          onDelete={onDelete}
          readOnly={readOnly}
          disabled={disabled}
          labelRemove={labelRemove}
        />
      </li>
    )
  })

class Input extends PureComponent {
  static propTypes = {
    tags: PropTypes.array,
    texts: PropTypes.object,
    onInputChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onTagRemove: PropTypes.func,
    onKeyDown: PropTypes.func,
    inputRef: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    activeDescendant: PropTypes.string,
    value: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.delayedCallback = debounce(e => this.props.onInputChange(e.target.value), 100)

    this.state = {
      value: '',
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value,
      })
    }
  }

  componentDidUpdate() {
    if (this.props.value) {
      this.setState({
        value: this.props.value,
      })
    }
  }

  handleInputChange = e => {
    e.persist()
    this.delayedCallback(e)
    this.setState({ value: e.target.value })
  }

  render() {
    const {
      tags,
      onTagRemove,
      inputRef,
      texts = {},
      onFocus,
      onBlur,
      disabled,
      readOnly,
      onKeyDown,
      activeDescendant,
      value,
    } = this.props

    return (
      <ul className={cx('tag-list')}>
        {/* {getTags(tags, onTagRemove, readOnly, disabled, texts.labelRemove)} */}

        <li className={cx('tag-item', 'tag-input')}>
          <input
            type="text"
            disabled={disabled}
            ref={inputRef}
            className={cx('search')}
            placeholder={texts.placeholder || ''}
            onKeyDown={onKeyDown}
            onChange={this.handleInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            aria-activedescendant={activeDescendant}
            aria-autocomplete={onKeyDown ? 'list' : undefined}
            {...getAriaLabel(texts.label)}
            value={this.state.value}
          />
        </li>
      </ul>
    )
  }
}

export default Input
