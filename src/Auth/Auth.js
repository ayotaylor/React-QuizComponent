// import React, { Component} from 'react'
import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";

let _accessToken = null;
let _idToken = null;
let _expiresAt = null;
let _scopes = null;

export default class Auth {
	constructor(history) {
		this.history = history;
		this.userProfile = null;
		this.requestedScopes = "openid profile email read:courses";

		this.auth0 = new auth0.WebAuth({
			domain: process.env.REACT_APP_AUTH0_DOMAIN,
			clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
			redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
			audience: process.env.REACT_APP_AUTH0_AUDIENCE,
			responseType: "token id_token", // access token and jwt token(for auth)
			scope: this.requestedScopes // use openid for auth, requeesting user profile scope and email. also ability to read courses
		});

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.handleAuthentication = this.handleAuthentication.bind(this);
		this.setSession = this.setSession.bind(this);
		this.isAuthenticated = this.isAuthenticated.bind(this);
		this.getAccessToken = this.getAccessToken.bind(this);
		this.getUserProfile = this.getUserProfile.bind(this);
		this.userHasScopes = this.userHasScopes.bind(this);
	}

	login() {
		localStorage.setItem(
			REDIRECT_ON_LOGIN,
			JSON.stringify(this.history.location.pathname)
		);
		this.auth0.authorize();
		localStorage.setItem("is_logged_in", true);
	}

	logout() {
		// localStorage.removeItem("access_token");
		// localStorage.removeItem("id_token");
		// localStorage.removeItem("expires_at");
		// localStorage.removeItem("scopes");

		// will reset on a redirect
		//this.userProfile = null;

		//this.history.push("/");
		localStorage.removeItem("is_logged_in");
		localStorage.removeItem(REDIRECT_ON_LOGIN);
		this.auth0.logout({
			clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
			returnTo: "http://localhost:3000"
		});
	}

	handleAuthentication() {
		this.auth0.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult);
				//debugger;
				const redirectLocation =
					localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
						? "/"
						: JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
				this.history.push(redirectLocation); // redirect to previous page
			} else if (err) {
				this.history.push("/");
				alert(
					"Error: ",
					{ err },
					"Check the console for further DOMSettableTokenList. "
				);
				console.log(err);
			}
			localStorage.removeItem(REDIRECT_ON_LOGIN);
		});
	}

	setSession(authResult) {
		// set time that access token will expire
		// const expiresAt = JSON.stringify(
		// 	authResult.expiresIn * 1000 + new Date().getTime()
		// );
		_expiresAt = authResult.expiresIn * 1000 + new Date().getTime(); // store in memory instead

		// if there's a value on the scope param from authResult,
		// use it to set scopes in the seesion for the user. otherwise,
		// use the scopes as requested. if no scopes were requested,
		// set it to nothing
		//const scopes = authResult.scope || this.requestedScopes || "";
		_scopes = authResult.scope || this.requestedScopes || ""; // store in memory instead
		debugger;
		// localStorage.setItem("access_token", authResult.accessToken);
		// localStorage.setItem("id_token", authResult.idToken);
		// localStorage.setItem("expires_at", expiresAt);
		// localStorage.setItem("scopes", JSON.stringify(scopes));
		_accessToken = authResult.accessToken; // store in memory instead
		_idToken = authResult.idToken; // store in memory instead
		debugger;
		this.scheduleRenewal();
	}

	isAuthenticated() {
		//const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
		return new Date().getTime() < _expiresAt;
	}

	getAccessToken() {
		//const accessToken = localStorage.getItem("access_token");
		if (!_accessToken) {
			throw new Error("No access toekn found");
		}
		return _accessToken;
	}

	getUserProfile(cb) {
		if (this.userProfile) return cb(this.userProfile);

		this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
			if (profile) this.userProfile = profile;
			cb(profile, err);
		});
	}

	userHasScopes(scopes) {
		//console.log("In userHasScopes");
		const grantedScopes = (_scopes || "").split(" ");
		debugger;
		return scopes.every(scope => grantedScopes.includes(scope));
	}

	renewToken(cb) {
		debugger;
		this.auth0.checkSession({}, (err, result) => {
			if (err) {
				console.log(`Error: ${err.error} - ${err.error_description}.`);
			} else {
				this.setSession(result);
			}
			if (cb) cb(err, result);
		});
	}

	scheduleRenewal() {
		debugger;
		const delay = _expiresAt - Date.now();
		if (delay > 0) setTimeout(() => this.renewToken(), delay);
	}
}
