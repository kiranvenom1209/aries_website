'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

export interface SelectOption {
  label: string
  value: string
  detail?: string
}

interface CustomSelectProps {
  id?: string
  name: string
  options: SelectOption[]
  defaultValue?: string
  placeholder?: string
  required?: boolean
}

/*
 * Listbox pattern: the trigger button owns focus and the keyboard; the open list is read through
 * aria-activedescendant. A visually-hidden native <select> mirrors the value so the form submits
 * the same field name and the browser's constraint validation still fires for `required`.
 */
export function CustomSelect({
  id,
  name,
  options,
  defaultValue,
  placeholder = 'Select an option',
  required,
}: CustomSelectProps) {
  const reactId = useId()
  const baseId = id ?? `select${reactId}`
  const listboxId = `${baseId}-listbox`
  const errorId = `${baseId}-error`
  const optionId = (index: number) => `${baseId}-opt-${index}`

  const [isOpen, setIsOpen] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? '')
  const [activeIndex, setActiveIndex] = useState(() => {
    const index = options.findIndex((opt) => opt.value === defaultValue)
    return index >= 0 ? index : 0
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const selectedOption = options.find((opt) => opt.value === selectedValue)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    document.getElementById(`${baseId}-opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, activeIndex, baseId])

  const open = () => {
    const index = options.findIndex((opt) => opt.value === selectedValue)
    setActiveIndex(index >= 0 ? index : 0)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const commit = (index: number) => {
    const option = options[index]
    if (option) {
      setSelectedValue(option.value)
      setInvalid(false)
    }
    close()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (isOpen) setActiveIndex((i) => Math.min(i + 1, last))
        else open()
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) setActiveIndex((i) => Math.max(i - 1, 0))
        else open()
        break
      case 'Home':
        if (!isOpen) return
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        if (!isOpen) return
        e.preventDefault()
        setActiveIndex(last)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen) commit(activeIndex)
        else open()
        break
      case 'Escape':
        if (!isOpen) return
        e.preventDefault()
        close()
        break
      case 'Tab':
        if (isOpen) setIsOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div className={`custom-select ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
      <select
        aria-hidden="true"
        className="custom-select__native"
        name={name}
        onChange={(e) => {
          setSelectedValue(e.target.value)
          if (e.target.value) setInvalid(false)
        }}
        onFocus={() => triggerRef.current?.focus()}
        onInvalid={(e) => {
          // Cancel the browser's report on the invisible mirror; show the message on the visible trigger instead.
          e.preventDefault()
          setInvalid(true)
          triggerRef.current?.focus()
        }}
        required={required}
        tabIndex={-1}
        value={selectedValue}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <button
        aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
        aria-controls={isOpen ? listboxId : undefined}
        aria-describedby={invalid ? errorId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-labelledby={`${baseId}-label ${baseId}`}
        className="custom-select__trigger"
        id={baseId}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        ref={triggerRef}
        type="button"
      >
        <span className={`custom-select__value ${selectedOption ? 'has-value' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          aria-hidden="true"
          className="custom-select__arrow"
          fill="none"
          height="12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="12"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul
          aria-labelledby={`${baseId}-label`}
          className="custom-select__menu"
          id={listboxId}
          role="listbox"
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue
            const isActive = index === activeIndex
            return (
              <li
                aria-selected={isSelected}
                className={`custom-select__option ${isSelected ? 'is-selected' : ''} ${isActive ? 'is-active' : ''}`}
                id={optionId(index)}
                key={option.value}
                onClick={() => commit(index)}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
              >
                <span className="custom-select__option-bullet" />
                <div className="custom-select__option-text">
                  <strong>{option.label}</strong>
                  {option.detail && <small>{option.detail}</small>}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {invalid ? (
        <p className="form-error custom-select__error" id={errorId} role="alert">
          Select an option.
        </p>
      ) : null}
    </div>
  )
}
