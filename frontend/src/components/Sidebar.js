// Sidebar.js

import React from 'react';
import '../css/sidebar.css';

function Sidebar(props) {

  return (
    <div>
      <ul>
        {props.collections.map((collection) => (
          <li key={collection.id} onClick={() => props.handleCollectionClick(collection)}>
            {collection.collectionName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
