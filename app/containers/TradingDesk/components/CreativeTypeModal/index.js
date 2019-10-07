/**
 *
 * CreativeTypeModal
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import messages from '../../messages';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
const CreativeTypeModal = ({ isOpen, closeModal, links }) => (
	<div>
		<Modal isOpen={isOpen} size="lg" centered className="creative">
			<a className="creative__close-modal" onClick={closeModal}>
				<i className="fas fa-times" />
			</a>
			<h1>
				<FormattedMessage {...messages.selectCreativeType} />
			</h1>
			<div className="creative--modal">
				{links.map(i => (
					<Link
						key={i.name}
						to={!i.disable ? i.link : false}
						className={i.disable ? 'creative--modal__link disable' : 'creative--modal__link'}
					>
						<img src={i.pic} alt={i.name} className="creative--modal__link--image" />
						<span>{i.name}</span>
						{i.span && <span>{i.span}</span>}
					</Link>
				))}
			</div>
		</Modal>
	</div>
);

CreativeTypeModal.propTypes = {
	isOpen: PropTypes.bool,
	closeModal: PropTypes.func,
	links: PropTypes.array,
};

export default CreativeTypeModal;
