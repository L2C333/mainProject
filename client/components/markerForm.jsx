import React, { Component } from 'react';
//form that renders when user clicks on the marker 
const Form = (props) => {
// //locationInfo: '',
// tagInfo: '',
// descriptionInfo: '',
// imgURL:
  return (
  <div>
  <form onSubmit ={props.onSubmit}>
    <label>
    Description:
    <textarea id = "description" value={props.descriptionInfo} name="descriptionInfo" rows= "10" onChange = {props.onChange}></textarea>    
    </label>
    <br></br>
    <label>
    Tag:
    <input type = 'text' value= {props.tagInfo} name="tagInfo" onChange = {props.onChange}></input>
    </label>
    <br></br>
    <label>
    Image URL:
    <input type = 'text' value={props.imgURL} name="imgURL" onChange = {props.onChange}></input>
    </label>
    <button type= 'submit'>Submit</button>
  </form>
  </div>
  )
}
export default Form;