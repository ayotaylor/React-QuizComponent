import React, { Component } from "react";

export default class Courses extends Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: []
		};
	}

	componentDidMount() {
		fetch("/courses", {
			headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
		})
			.then(response => {
				if (response.ok) return response.json();
				throw new Error("Network response was not ok");
			})
			.then(response => this.setState({ courses: response.courses }))
			.catch(error => this.setState({ courses: error.message }));

		fetch("/admin", {
			headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
		})
			.then(response => {
				if (response.ok) return response.json();
				throw new Error("Network response was not ok");
			})
			.then(response => console.log(response))
			.catch(error => this.setState({ courses: error.message }));
	}

	render() {
		return (
			<ul>
				{this.state.courses.map(course => {
					return <li key={course.id}>{course.title}</li>;
				})}
			</ul>
		);
	}
}
