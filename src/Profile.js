import React, { Component } from "react";

export default class Profile extends Component {
	constructor() {
		super();
		this.state = {
			profile: null,
			error: ""
		};

		this.loadUserProfile = this.loadUserProfile.bind(this);
	}

	componentDidMount() {
		this.loadUserProfile();
	}

	loadUserProfile() {
		this.props.auth.getUserProfile((profile, error) =>
			this.setState({ profile, error })
		);
	}
	render() {
		const { profile } = this.state;
		if (!profile) return null;
		return (
			<React.Fragment>
				<h1>Profile</h1>
				<p>{profile.nickname}</p>
				<img
					style={{ maxWidth: 50, maxHeight: 50 }}
					src={profile.picture}
					alt="profile pic"
				/>
				<pre>{JSON.stringify(profile, null, 2)}</pre>
				<button onClick="">Take Quiz</button>
			</React.Fragment>
		);
	}
}
