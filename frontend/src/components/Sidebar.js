// Sidebar.js

import React from 'react';
import '../css/sidebar.css';

function Sidebar(props) {
    
  console.log(props.collections);

  return (
    <div className="sidebar" onMouseOut={props.closeSidebar}>
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
