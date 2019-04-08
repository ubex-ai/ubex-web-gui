import React from 'react';
// used for making the prop types of this component
import PropTypes from 'prop-types';

function CardAuthor(props) {
	return (
		<div className="author">
			<a href={props.link ? props.link : '#'}>
				{/*<img className="avatar border-gray" src={props.avatar} alt={props.avatarAlt} />*/}
				<h5 className="title">{props.title}</h5>
			</a>
			<p className="description">{props.description}</p>
		</div>
	);
}

CardAuthor.propTypes = {
	// Where the user to be redirected on clicking the avatar
	link: PropTypes.string,
	avatar: PropTypes.string,
	avatarAlt: PropTypes.string,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default CardAuthor;
