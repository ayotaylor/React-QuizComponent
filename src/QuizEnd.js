import React, { Component } from "react";
import { Link } from "react-router-dom";

class QuizEnd extends Component {
	constructor(props) {
		super(props);
		this.handleResetClick = this.handleResetClick.bind(this);
	}

	handleResetClick() {
		this.props.resetClickHandler();
	}

	render() {
		return (
			<div>
				<p>Thanks for playing!</p>
				<Link to="/quiz" onClick={this.handleResetClick}>
					Reset Quiz
				</Link>
			</div>
		);
	}
}

export default QuizEnd;
