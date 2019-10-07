/**
 *
 * FilterListFields
 *
 */

import React from 'react';
import { Input, Label, FormGroup, Button, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import messages from '../../containers/TradingDesk/messages';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class BlackListFields extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			labels: {
				domains: 'Domain',
				urls: 'Direct URL',
				publishers: 'Publisher ID',
				sites_id: 'Site/App ID',
				apps: 'App name',
				devices: 'Device ID (IDFA/GAID)',
				bundles: 'Bundle ID',
				ips: 'User IP',
			},
			placeholders: {
				domains: 'Example:\nexample1.com;example2.net',
				urls: 'Example:\nsite1.com/page1;site2.com/page2',
				publishers: 'Example:\npub_123456;pub_0987654',
				sites_id: 'Example:\nsite_id1;site_id2',
				apps: 'Example:\napp_name1;app_name2',
				devices: 'Example:\n97987bca-ae59-4c7d-94ba-ee4f19ab8c21;30255BCE-4CDA-4F62-91DC-4758FDFF8512',
				bundles: 'Example:\ncom.ubex.123;com.appid.123',
				ips: 'Example:\n192.168.0.1-255;192.168.0.1',
			},
		};
		this.changeInput = this.changeInput.bind(this);
	}

	componentDidMount() {
		const { fields, id } = this.props;
		if (id && fields && Object.keys(fields).length) {
			this.setState({
				[id]: fields,
			});
		}
	}

	changeInput(id, key, text) {
		this.setState(prevState => ({
			[id]: { ...prevState[id], [key]: text.length ? text.replace(/\s+/g, '').split(';') : [] },
		}));
	}

	patchFilter(id) {
		this.props.patchFilter(id, this.state[id]);
	}

	render() {
		const { id } = this.props;
		return this.state[id] && Object.keys(this.state[id]).length ? (
			<div className="blackList" id={id}>
				<div className="blackList-wrapper">
					<Row>
						{Object.keys(this.state[id]).map(key => (
							<Col md={3} key={key}>
								<FormGroup>
									<Label>{this.state.labels[key] ? this.state.labels[key] : ''}</Label>
									<Input
										type="textarea"
										name={key}
										id={key}
										placeholder={this.state.placeholders[key] ? this.state.placeholders[key] : ''}
										value={
											this.state[id][key] && this.state[id][key].length
												? this.state[id][key].join(';')
												: this.state[id][key]
										}
										onChange={e => {
											this.changeInput(id, key, e.target.value);
										}}
									/>
								</FormGroup>
							</Col>
						))}
					</Row>
				</div>
				<Button color="success" onClick={() => this.patchFilter(id)} className="mt-2">
					<FormattedMessage id="app.common.save" />
				</Button>
			</div>
		) : null;
	}
}

BlackListFields.propTypes = {
	fields: PropTypes.object,
	id: PropTypes.number.isRequired,
	patchFilter: PropTypes.func.isRequired,
};

export default BlackListFields;
