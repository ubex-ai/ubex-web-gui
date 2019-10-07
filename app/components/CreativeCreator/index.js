/**
 *
 * CreativeCreator
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Alert, Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import TemplatePropsEditor from './TemplatePropsEditor';
import SizeSelector from './SizeSelector';
import CreativePreview from './CreativePreview';

/* eslint-disable react/prefer-stateless-function */
class CreativeCreator extends React.Component {
	sizes = [
		{
			w: 300,
			h: 250,
			label: '300x250',
		},
		{
			w: 240,
			h: 400,
			label: '240x400',
		},
	];

	state = {
		activeSize: null,
		templateProps: {
			bgImage: 'https://www.ubex.com/images/seo.svg',
			mainTextColor: '#FF0000',
			mainTextVal: 'Основной текст',
			additionalTextColor: '#00FF00',
			additionalTextVal: 'Дополнительный текст',
		},
	};

	onChangeTemplateProp(propKey, val) {
		this.setState({
			templateProps: {
				...this.state.templateProps,
				[propKey]: val,
			},
		});
	}

	onChangeSize(sizeNumber) {
		this.setState({
			activeSize: this.sizes[sizeNumber],
		});
	}

	render() {
		return (
			<div>
				<h1>
					<FormattedMessage {...messages.header} />
				</h1>
				<Row>
					<Col lg={3}>
						{/* Настройки шаблона */}
						<TemplatePropsEditor
							templateProps={this.state.templateProps}
							onChangeProp={this.onChangeTemplateProp.bind(this)}
						/>
					</Col>
					<Col lg={7}>
						{/* Превью креатива */}
						<CreativePreview size={this.state.activeSize} {...this.state.templateProps} />
					</Col>
					<Col lg={2}>
						{/* Переключалка размеров */}
						<SizeSelector sizes={this.sizes} onChangeSize={this.onChangeSize.bind(this)} />
					</Col>
				</Row>
			</div>
		);
	}
}

CreativeCreator.propTypes = {};

export default CreativeCreator;
