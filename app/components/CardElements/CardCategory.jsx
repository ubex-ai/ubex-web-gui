import React from 'react';
import PropTypes from 'prop-types';

function CardCategory(props) {
	return <h5 className="card-category">{props.children}</h5>;
}

CardCategory.propTypes = {
	children: PropTypes.any,
};

export default CardCategory;
