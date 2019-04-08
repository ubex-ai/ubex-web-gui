import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';

class Navmenudropdown extends React.Component {
	constructor(props) {
		super(props);
		this.addClickClass = this.addClickClass.bind(this);
		this.state = {
			activate: false,
		};
	}

	addClickClass() {
		this.setState({
			activate: !this.state.activate,
		});
	}

	render() {
		const children = child => {
			const links = [];
			if (child) {
				for (let i = 0; i < child.length; i++) {
					links.push(
						<li key={i}>
							<NavLink to={child[i].path} className="nav-link" activeClassName="active">
								<span>{child[i].name}</span>
							</NavLink>
						</li>,
					);
				}
				return <Nav>{links}</Nav>;
			}
		};

		return (
			<li className={`${this.state.activate ? 'active' : ''} ${this.props.openclass}`} data-toggle="collapse">
				<a to={this.props.path} className="nav-link" onClick={this.addClickClass}>
					<i className={`fa fa-${this.props.icon}`} />
					<p>{this.props.name}</p>
					<span className="badge">{this.props.badge}</span>
					<span className="arrow fa fa-chevron-left" />
				</a>
				{children(this.props.child)}
			</li>
		);
	}
}
export default Navmenudropdown;
