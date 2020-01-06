import React, { Component } from 'react';
//box that will render with the user's saved input values when they click on a marker 
const Box = ({clickedMarker}) =>{
  return(
    <div>
      <p>
      tag: {clickedMarker.tag}
      </p>
      <p>
      description: {clickedMarker.description}
      </p>
    </div>
  )
}

export default Box;