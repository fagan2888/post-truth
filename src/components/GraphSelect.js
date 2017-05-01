import React from 'react';

import styles from './GraphSelect.module.css';

export default function({
  value,
  onChange,
  dataset,
  meta
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
      { meta && (
        <ul>
          <li><strong>Model: </strong>{ meta.model }</li>
          <li><strong>Infection Property: </strong>{ meta.infection_property }</li>
          <li><strong>Infection Bias: </strong>{ meta.infection_bias }</li>
          <li><strong>Directed: </strong>{ meta.directed }</li>
        </ul>
      ) }
    </div>
  );
}