import PropTypes from 'prop-types';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

class AppSafeframe extends React.Component {
	constructor(props) {
		super(props);
		this.pos = null;
	}

	componentDidMount() {
		this.updatePos();
	}

	componentDidUpdate(prevProps) {
		this.updatePos();
	}

	componentWillUnmount() {
		delete this.pos;
	}

	updatePos() {
		const { slotId, size, html, url } = this.props;
		if (!html && !url) {
			console.warn('no resource for safeframe');
			return;
		}

		const cont = document.getElementById(this.props.slotId);
		if (!cont) {
			console.warn('root container not found');
			return;
		}

		let sfCont = document.getElementById(`ubx_${this.props.slotId}`);
		if (sfCont) {
			return;
		}
		sfCont = document.createElement('div');
		sfCont.id = `ubx_${this.props.slotId}`;

		cont.insertBefore(sfCont, cont.children[0]);
		$sf.host.nuke(slotId);

		if (html) {
			this.pos = new $sf.host.Position({
				id: slotId,
				dest: `ubx_${slotId}`,
				html,
				...size,
			});
		} else {
			this.pos = new $sf.host.Position({
				id: slotId,
				dest: `ubx_${slotId}`,
				src: url,
				...size,
			});
		}
		$sf.host.render(this.pos);
	}
}

AppSafeframe.propTypes = {
	slotId: PropTypes.object.isRequired,
	html: PropTypes.string.isRequired,
};

export default AppSafeframe;
