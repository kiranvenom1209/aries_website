'use client'

import { useEffect, useRef, useState } from 'react'

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

export function CustomSelect({
  id,
  name,
  options,
  defaultValue,
  placeholder = 'Select option...',
  required,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || '')
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className={`custom-select ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
      <input name={name} required={required} type="hidden" value={selectedValue} />
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="custom-select__trigger"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="custom-select__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
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
        <ul className="custom-select__menu" role="listbox">
          {options.map((option) => {
            const isSelected = option.value === selectedValue
            return (
              <li
                aria-selected={isSelected}
                className={`custom-select__option ${isSelected ? 'is-selected' : ''}`}
                key={option.value}
                onClick={() => {
                  setSelectedValue(option.value)
                  setIsOpen(false)
                }}
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
    </div>
  )
}
