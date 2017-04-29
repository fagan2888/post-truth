import React from 'react';

import styles from './Loading.module.css';

export default function() {
  return (
    <div className={ styles.container }>
      { 'Please wait a moment' }
    </div>
  );
}
