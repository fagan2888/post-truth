import React from 'react';

import styles from './GraphSelect.module.css';

export default function({
  value,
  onChange,
  dataset
}) {
  return (
    <div className={ styles.container }>
      { 'Select a graph' }
      <select
        defaultValue={ value }
        onChange={ onChange }
      >
        { 
          Object.keys(dataset).map(
            path => (
              <option
                value={ path }
                key={ path }
              >
                { dataset[path] }
              </option>
            )
          ) 
        }
      </select>
    </div>
  );
}