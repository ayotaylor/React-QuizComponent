import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";

function SecureRoute({ component: Component, auth, scopes, ...rest }) {
	return (
		<AuthContext.Consumer>
			{auth => (
				<Route
					{...rest}
					render={props => {
						// redirect to login page if not logged in
						if (!auth.isAuthenticated()) return auth.login();

						// display message if user lacks authorized scope(s)
						if (scopes.length > 0 && !auth.userHasScopes(scopes)) {
							return (
								<h1>
									Unauthorized - You need the following scope(s) to view this
									page: {scopes.join(",")}
								</h1>
							);
						}

						return <Component auth={auth} {...props} />;
					}}
				/>
			)}
		</AuthContext.Consumer>
	);
}

// define what each prop type is accepted
SecureRoute.propTypes = {
	component: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	scopes: PropTypes.array
};

// set default value for props
SecureRoute.defaultProps = {
	scopes: []
};

export default SecureRoute;
