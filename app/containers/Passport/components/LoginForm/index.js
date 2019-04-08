import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	handleSubmit(e) {
		e.preventDefault();
		const { email, password } = this.state;
		this.props.submit(email, password);
	}

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

					<p className="form_side__description">Password</p>
					<span className="help-block">
						<strong>ERROR</strong>
					</span>
					<p className="form_side__input_holder">
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							onChange={this.handleChange}
							placeholder="Enter your password"
							required
						/>
					</p>

					<p className="form_side__button row">
						<Link to="/passport/signup" className="register col-lg-4">
							Sign Up
						</Link>
						<Button type="submit" className="btn btn-lg btn-primary col-lg-4">
							Login
						</Button>
						<Link to="/passport/restore" className="register col-lg-4">
							Forgot?
						</Link>
					</p>
				</form>
			</section>
		);
	}
}

LoginForm.propTypes = {
	submit: PropTypes.func.isRequired,
};

export default LoginForm;
