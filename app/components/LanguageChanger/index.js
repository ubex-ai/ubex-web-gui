/**
 *
 * LanguageChanger
 *
 */

import React from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { appLocales } from 'i18n';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class LanguageChanger extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notificationsddOpen: false,
		};
		this.notificationsddToggle = this.notificationsddToggle.bind(this);
	}

	notificationsddToggle(e) {
		this.setState({
			notificationsddOpen: !this.state.notificationsddOpen,
		});
	}

	render() {
		const listItems = appLocales.map(item =>
			this.props.currentLanguage !== item ? (
				<DropdownItem tag="a" key={item} onClick={() => this.props.changeLocale(item)}>
					<div className={`flag flag--${item}`} />
					<FormattedMessage id={`app.language.${item}`} />
				</DropdownItem>
			) : null,
		);
		return (
			<Dropdown
				nav
				isOpen={this.state.notificationsddOpen}
				toggle={e => this.notificationsddToggle(e)}
				className="country"
			>
				<DropdownToggle caret nav>
					{this.props.currentLanguage && (
						<div className="language-changer">
							<div className={`flag flag--${this.props.currentLanguage}`} />
							<p>
								<FormattedMessage id={`app.language.${this.props.currentLanguage}`} />
							</p>
						</div>
					)}
				</DropdownToggle>
				<DropdownMenu right>{listItems}</DropdownMenu>
			</Dropdown>
		);
	}
}

LanguageChanger.propTypes = {
	currentLanguage: PropTypes.string,
	changeLocale: PropTypes.func,
};

export default LanguageChanger;
