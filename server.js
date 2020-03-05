const express = require("express");
require("dotenv").config();

const jwt = require("express-jwt"); // validate jwt and set req.user
const jwksRsa = require("jwks-rsa"); // retrieve rsa keys from a json web key set (jkws) endpoint
const checkScope = require("express-jwt-authz"); // validates jwt scopes

const checkJwt = jwt({
	// dynamically provide a signing key based on the kind in the header
	// and the signing keys provided by the jwks endpoint
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
	}),

	// validate the audience and the issuer
	audience: process.env.REACT_APP_AUTH0_AUDIENCE,
	issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

	// this must match the algorithm selected in the Auth0 dashboard under app's advanced setting under the OAuth tab
	algorithms: ["RS256"]
});

const app = express();

app.get("/public", function(req, res) {
	res.json({
		message: "Hell from a public API"
	});
});

app.get("/private", checkJwt, function(req, res) {
	res.json({
		message: "Hell from a private API"
	});
});

app.get("/courses", checkJwt, checkScope(["read:courses"]), function(req, res) {
	res.json({
		courses: [
			{ id: 1, title: "Building APps with React and Redux" },
			{ id: 2, title: "Creating Reusable React components" }
		]
	});
});

function checkRole(role) {
	return function(req, res, next) {
		const assignedRoles = req.user["http://localhost:3000/roles"];
		if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
			return next();
		} else {
			return res.status(401).send("Insufficient role");
		}
	};
}

app.get("/admin", checkJwt, checkRole("admin"), function(req, res) {
	res.json({
		message: "Hell from an admin API"
	});
});

app.listen(3001);
console.log("API server listening on ", process.env.REACT_APP_API_URL);
