import React from 'react'

export default function ButtonGroup({ options,  }) {
  return (
    <div className="button-group">
        {options.map(option => (
            <button
            key={option.value}
            // className={option.value === selectedOption ? 'active' : ''}
            onClick={option.onClick}
            >
            {option.label}
            </button>
        ))}
    </div>
  )
}
