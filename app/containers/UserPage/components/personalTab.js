import React from 'react';
import { Button, Form, Row, Col } from 'reactstrap';
import ContactsForm from './contactsForm';
import WalletsForm from './walletsForm';
import KYCForm from './KYCForm';

export default class PersonalTab extends React.Component {
	constructor(props) {
		super(props);

		this.toggleDropDown = this.toggleDropDown.bind(this);
		this.toggleSplit = this.toggleSplit.bind(this);
		this.state = {
			dropdownOpen: false,
			splitButtonOpen: false,
		};
	}

	toggleDropDown() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
		});
	}

	toggleSplit() {
		this.setState({
			splitButtonOpen: !this.state.splitButtonOpen,
		});
	}

	render() {
		return (
			<div>
				<div className="content-body">
					<Row>
						<Col>
							<ContactsForm />
							<WalletsForm />
						</Col>
						<Col>
							<KYCForm />
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
