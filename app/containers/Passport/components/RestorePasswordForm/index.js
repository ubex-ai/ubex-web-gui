/**
 *
 * RestorePassword
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class RestorePassword extends React.PureComponent {
	render() {
		return (
			<section className="form_side">
				<h2>
					<FormattedMessage {...messages.header} />
				</h2>
				<form
					id="login_form"
					action="/"
					method="post"
					onSubmit={this.handleSubmit}
					className="needs-validation"
					noValidate
				>
					<p className="form_side__description">Email</p>
					<span className="help-block">
						<strong>ERROR</strong>
					</span>
					<p className="form_side__input_holder">
						<input
							type="text"
							className="form-control"
							id="email"
							name="email"
							onChange={this.handleChange}
							placeholder="Enter your email"
							required
						/>
					</p>

					<p className="form_side__button row">
						<Link to="/passport/signup" className="register col-lg-4">
							Sign Up
						</Link>
						<Button type="submit" className="btn btn-lg btn-primary col-lg-4">
							Restore
						</Button>
						<Link to="/passport/login" className="register col-lg-4">
							Login
						</Link>
					</p>
				</form>
			</section>
		);
	}
}

RestorePassword.propTypes = {};

export default RestorePassword;
