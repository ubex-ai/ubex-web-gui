import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';

import { Navmenudropdown } from 'components';
import { Navmenugroup } from 'components';

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
import useravatar from 'assets/img/profile.jpg';

let ps;

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.activeRoute.bind(this);
		this.state = {
			opendd: '',
		};
		this.handleOpendd = this.handleOpendd.bind(this);
	}

	handleOpendd(open) {
		// this.setState({      opendd: open    });
	}

	// verifies if routeName is the one active (in browser input)
	activeRoute(routeName) {
		return this.props.location.pathname.indexOf(routeName) > -1 ? ' active' : '';
	}

	componentDidMount() {
		if (navigator.platform.indexOf('Win') > -1) {
			ps = new PerfectScrollbar(this.refs.sidebar, { suppressScrollX: true, suppressScrollY: false });
		}
	}

	componentWillUnmount() {
		if (navigator.platform.indexOf('Win') > -1) {
			ps.destroy();
		}
	}

	render() {
		return (
			<div className="sidebar menubar" data-color="white">
				<div className="sidebar-wrapper" ref="sidebar">
					<div className="profile-info row">
						<div className="profile-image col-4">
							<a href="#!">
								{/*<img alt="" src={useravatar} className="img-fluid rounded-circle" />*/}
							</a>
						</div>
						<div className="profile-details col-8">
							<h3>
								<a href="ui-profile.php">Shane Taylor</a>
								<span className="profile-status online" />
							</h3>
							<p className="profile-title">Web Developer</p>
						</div>
					</div>

					<Nav className="navigation">
						{this.props.routes.map((prop, key) => {
							if (prop.redirect) return null;
							if (prop.type === 'child') return null;
							if (prop.type === 'navgroup') return <Navmenugroup name={prop.name} key={key} />;
							if (prop.type === 'dropdown')
								return (
									<Navmenudropdown
										name={prop.name}
										icon={prop.icon}
										path={prop.path}
										badge={prop.badge}
										child={prop.child}
										key={key}
										openclass={this.state.opendd === prop.name ? 'activethis' : ''}
										onClick={() => this.handleOpendd(prop.name)}
									/>
								);
							return (
								<li className={this.activeRoute(prop.path)} key={key}>
									<NavLink to={prop.path} className="nav-link" activeClassName="active">
										<i className={`fa fa-${prop.icon}`} />
										<p>{prop.name}</p>
										<span className="badge">{prop.badge}</span>
									</NavLink>
								</li>
							);
						})}
					</Nav>
				</div>
			</div>
		);
	}
}

export default Sidebar;
