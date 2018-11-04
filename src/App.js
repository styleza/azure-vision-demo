import React, { Component } from 'react';
import logo from './logo.svg';
import Config from './config.js';
import axios from 'axios';

class App extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			url: "https://www.terveystalo.com/Global/Etusivu/Bannerit%202018/TT-toimisto-740x460.jpg",
			tags: [],
			captions: []
		};
		this.analyzeImage();
	}
	analyzeImage = () => {
		axios.post(
			`${Config.url}/vision/v2.0/describe`,
			JSON.stringify({
				url: this.state.url
			}),
			{
				headers: {
					"Content-Type": "application/json",
					"Ocp-Apim-Subscription-Key": Config.key 
				}
			}
		).then((response) => {
			if(response.status === 200){
				this.setState({
					tags: response.data.description.tags,
					captions: response.data.description.captions
				});
			} else {
				console.log(response);
			}
		});
	}
	changeUrl = (event) => {
		this.setState({url: event.target.value});
	}
  render() {
    return (
      <div className="App">
        <input type="text" style={{width:"900px"}} value={this.state.url} onChange={this.changeUrl}></input>
		<button onClick={this.analyzeImage}>Analyze!</button>
		{this.state.tags.length>0 && (
			<div style={{float:"left"}}>
				<h1>Detected tags</h1>
				<ul>
				{this.state.tags.map((v) => (<li>{v}</li>))}
				</ul>
			</div>	
		)}
		{this.state.captions.length>0 && (
			<div style={{float:"right", "margin-right": "10px"}}>
				<h1>Captions</h1>
				<ul>
				{this.state.captions.map((v) => (<li>{v.text} (confidence: {v.confidence}</li>))}
				</ul>
			</div>	
		)}
		<div style={{float:"right", "margin-right": "10px"}}>
			<img src={this.state.url} alt="Image to be analyzed"></img>
		</div>
      </div>
    );
  }
}

export default App;
