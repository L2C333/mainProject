
import React from 'react';
import { Component } from "react";
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
// import mapDisplay from './components/testMapDisplay.jsx'
import MapDisplay from './components/mapDisplay.jsx';
import MarkerForm from './components/markerForm.jsx';
import ImageDisplay from './components/imageDisplay.jsx';
import MarkerInfoBox from './components/markerInfoBox.jsx';

//this one renders ya know the app.

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgList: [],
            userWhiteList: [],
            markerList: [{tag: 'food', location: {lat: 45, lng: 45}, description: 'this tag is a test of tags', imgURL: 'this is a URL '}],
            locationInfo: '',
            tagInfo: '',
            descriptionInfo: '',
            imgURL: '',
            searchTag: '',
            savedTag: '',
            whiteListUserInfo: '',
            clickedMarker: ''
    }
    this.onChange = this.onChange.bind(this);
    this.clickMap = this.clickMap.bind(this);
    this.clickMarker = this.clickMarker.bind(this);
    this.onSubmit= this.onSubmit.bind(this);
    this.buttonSubmit=this.buttonSubmit.bind(this);
    }
    clickMarker(e) {
        // console.log(e)
        // console.log( "Latitude: "+e.latLng.lat()+" "+", longitude: "+e.latLng.lng())
        let clickedMarker = [...this.state.markerList];
        clickedMarker = clickedMarker.filter((marker) => {
            console.log('marker', marker);
            return (marker.location.lat == e.latLng.lat() && marker.location.lng == e.latLng.lng())
        })
        console.log('clickedMarker', clickedMarker);
        this.setState({clickedMarker: clickedMarker[0]})
        // console.log('current saved marker' , this.state.clickedMarker)
    }
    clickMap(e) {
        // console.log( "Latitude: "+e.latLng.lat()+" "+", longitude: "+e.latLng.lng())
        //create a new marker that has the lat and lng of the location you clicked on as well as other information
        let newMarker = {tag:'', location: {lat: e.latLng.lat(), lng:e.latLng.lng()}, description: ''}
        let newMarkerList = [...this.state.markerList]
        //push the new marker in the newMarketList array which contains the other markers 
        newMarkerList.push(newMarker);
        //set the markerList state to the newMarkerList which contains the information of the newMarker 
        this.setState({markerList: newMarkerList})
        //sending the newMarker data to the server and adding data entry
        fetch('/addMarker', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify({...newMarker, longitude: newMarker.location.lng, latitude: newMarker.location.lat}), // body data type must match "Content-Type" header
            //mode: 'cors', // no-cors, *cors, same-origins
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            //redirect: 'follow', // manual, *follow, error
            //referrerPolicy: 'no-referrer', // no-referrer, *client
            
          })
          .then((res)=> {
              console.log('inside post then', res)})
    }
    onChange(e) {
      //takes typed information and sets relevant state
      // console.log(e.target.value);
      //we set up the name in our markerForm component. Allows us to only use one onChange for multiple form inputs! 
      //name will distinguish what input the change is coming from 
      this.setState({[e.target.name]: e.target.value},()=>{
        // console.log('after setState onChange', this.state.markerList);
      })
    }
    buttonSubmit(){
      //when we push submit for filtering marker by tag, save the input value in savedTag and set the searchTag back to an empty string 
      this.setState({savedTag: this.state.searchTag, searchTag: ''},()=>{
        console.log(`savedTag`,this.state.savedTag);
        console.log(`searchTag`,this.state.searchTag);
      });
    }
    //onSubmit: take the stored information and update the state 
    onSubmit(e) {
        //prevents the page from refreshing when we click submit   
        e.preventDefault();     
        const clicked = this.state.clickedMarker;
        let imgProps = '';
        let imgListVar = this.state.imgURL;
        // console.log(this.state.imgURL)
        //splitting the image urls by a '-' into an array
        imgListVar = imgListVar.split('-');
        // console.log('imglistvariable' , imgListVar)
        //if an image in the array exists
        if (imgListVar[0]) {
            imgProps = imgListVar
            //if we update and add another image, add it to the imgProps
            if (clicked.imgURL) {
            imgProps = imgListVar.concat(clicked.imgURL)
            }
        }
        // console.log('before modified marker' ,this.state.descriptionInfo)
        const modifiedMarker = Object.assign(clicked, {tag: this.state.tagInfo || clicked.tag, description: this.state.descriptionInfo || clicked.description, imgURL: imgProps || clicked.imgURL});
        // console.log('in submit showing modMarker' , modifiedMarker, modifiedMarker.description)
        let newMarkerList = [...this.state.markerList];
        //filter through the current saved markers and add the ones that are not equal to the new one we just made 
        newMarkerList = newMarkerList.filter((marker) => {
          return (marker.location.lat !== this.state.clickedMarker.location.lat || marker.location.lng !== this.state.clickedMarker.location.lng)
        })
        //then to our list of markers we add in the modified marker we just created
        newMarkerList.push(modifiedMarker);
        //update the state to have empty form info and updated markerList
        this.setState({tagInfo: '', descriptionInfo: '', imgURL: '', clickedMarker: '', markerList: newMarkerList}, ()=>{
          // console.log(`after setState for onsubmit`,this.state);
          // console.log('before fetch-lng-lat: ' , modifiedMarker.location.lng, modifiedMarker.location.lat)
        });
        // console.log('before fetch-lng-lat: ' , modifiedMarker.location.lng, modifiedMarker.location.lat)
        fetch('/updateMarker', {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify({...modifiedMarker, longitude: modifiedMarker.location.lng, latitude: modifiedMarker.location.lat}), // body data type must match "Content-Type" header
            //mode: 'cors', // no-cors, *cors, same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            //redirect: 'follow', // manual, *follow, error
            //referrerPolicy: 'no-referrer', // no-referrer, *client
            
          })
          .then((res)=> {
              console.log('inside patch then', res)})
    }
    render() {
      let markerForm;
      let markerInfoBox; 
      let imageDisplay;
      //if you click on a marker, render the markerForm 
      if(this.state.clickedMarker){
        markerForm = <MarkerForm imgURL={this.state.imgURL} tagInfo = {this.state.tagInfo} locationInfo={this.state.locationInfo} descriptionInfo={this.state.descriptionInfo} onChange ={this.onChange} onSubmit={this.onSubmit}/>
      }
      //if there is a tag or description filled out, render the info box with the inputted fields
      if(this.state.clickedMarker.tag || this.state.clickedMarker.description){
        markerInfoBox = <MarkerInfoBox clickedMarker ={this.state.clickedMarker}/>
      }
      //to render the images 
      if (this.state.clickedMarker ) {
          imageDisplay = <ImageDisplay clickedMarker={this.state.clickedMarker}/>
      }
        return (
            <div id="map">This is the app.jsx div
              {imageDisplay}
            <div>
              <MapDisplay clickedMarker={this.state.clickedMarker} clickMarker={this.clickMarker} clickMap={this.clickMap} markerList={this.state.markerList} onChange ={this.onChange} searchTag = {this.state.searchTag} buttonSubmit ={this.buttonSubmit} savedTag = {this.state.savedTag}/>
              {markerInfoBox}
            </div>
            {markerForm}
            </div>
        )
    }
}