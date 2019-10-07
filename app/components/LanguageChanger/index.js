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
import Spinner from 'reactstrap/es/Spinner';
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

	changeLocale(item) {
		this.props.changeLocale(item);
		this.props.onChange({ language: item });
	}

	render() {
		const listItems = appLocales.map(
			item =>
				this.props.currentLanguage !== item ? (
					<DropdownItem tag="a" key={item} onClick={() => this.changeLocale(item)}>
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
				<DropdownToggle caret nav className={this.props.loading ? 'loading' : null}>
					{this.props.currentLanguage && !this.props.loading ? (
						<div className="language-changer">
							<div className={`flag flag--${this.props.currentLanguage}`} />
							<p>
								<FormattedMessage id={`app.language.${this.props.currentLanguage}`} />
							</p>
						</div>
					) : <Spinner size="sm"/>}
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
