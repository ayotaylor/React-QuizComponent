import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
// import "./App.css";

import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Quiz from "./Quiz";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import SecureRoute from "./SecureRoute";
import AuthContext from "./AuthContext";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			auth: new Auth(this.props.history),
			tokenRenewalComplete: false
		};
	}

	componentDidMount() {
		console.log("Mounting App.js");
		console.log("tokenRenewalComplete: ", this.state.tokenRenewalComplete);
		const loggedIn = localStorage.getItem("is_logged_in");
		loggedIn &&
			this.state.auth.renewToken(() =>
				this.setState({ tokenRenewalComplete: true })
			);
	}

	render() {
		const { auth } = this.state;
		const loggedIn = localStorage.getItem("is_logged_in");
		if (loggedIn && !this.state.tokenRenewalComplete) return "Loading...";
		return (
			<AuthContext.Provider value={auth}>
				<Nav auth={auth} />
				<div className="body">
					<Route
						path="/"
						exact
						render={props => <Home auth={auth} {...props} />}
					/>
					<Route
						path="/callback"
						render={props => <Callback auth={auth} {...props} />}
					/>
					{/* BEFORE WE CONSOLIDATED INTO SECUREROUTE COMPONENT
					<Route
						path="/profile"
						render={props =>
							this.auth.isAuthenticated() ? (
								<Profile auth={this.auth} {...props} />
							) : (
								<Redirect to="/" />
							)
						}
					/> */}

					<SecureRoute path="/profile" component={Profile} auth={auth} />

					<Route path="/public" component={Public} />

					{/* BEFORE WE CONSOLIDATED INTO SECUREROUTE COMPONENT
					<Route
						path="/private"
						render={props =>
							this.auth.isAuthenticated() ? (
								<Private auth={this.auth} {...props} />
							) : (
								this.auth.login()
							)
						}
					/>
					<Route
						path="/courses"
						render={props =>
							this.auth.isAuthenticated() &&
							this.auth.userHasScopes(["read:courses"]) ? (
								<Courses auth={this.auth} {...props} />
							) : (
								this.auth.login()
							)
						}
					/> */}
					{/* AFTER WE CONSOLIDATED INTO SECUREROUTE COMPONENT */}
					<SecureRoute path="/private" component={Private} auth={auth} />
					<SecureRoute
						path="/courses"
						component={Courses}
						scopes={["read:courses"]}
						auth={auth}
					/>
					<SecureRoute path="/quiz" component={Quiz} auth={auth} />
				</div>
			</AuthContext.Provider>
			// <Quiz />  add this to auth/authz app later. maybe open from profile page
		);
	}
}

export default App;
