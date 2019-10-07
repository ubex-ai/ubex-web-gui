import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'perfect-scrollbar';
import logofull from 'assets/img/logo.svg';
import logomini from 'assets/img/logo3.png';
import logoIE from 'assets/img/logoIE.png';
import Navmenudropdown from 'components/Navmenudropdown/Navmenudropdown';
import Navmenugroup from 'components/Navmenudropdown/Navmenugroup';
import { twitter, facebook, instagram, telegram, youtube, linkedin } from 'assets/img/social';
import managers from 'variables/managers';
// javascript plugin used to create scrollbars on windows

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
		if (this.state.opendd === open) {
			this.setState({
				opendd: '',
			});
		} else {
			this.setState({
				opendd: open,
			});
		}
	}

	// verifies if routeName is the one active (in browser input)
	activeRoute(routeName) {
		return this.props.location.pathname.indexOf(routeName.split(':')[0]) > -1 ? ' active' : '';
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
		const children = (parentName, child) => {
			const links = [];
			if (child) {
				for (let i = 0; i < child.length; i++) {
					if (child[i].sidebar || (typeof child[i].sidebar === 'undefined' && child[i].type !== 'child')) {
						links.push(
							<li key={i}>
								<NavLink to={child[i].path} className="nav-link" activeClassName="active">
									<span>
										<FormattedMessage id={`app.sidebar.${parentName}.${child[i].name}`} />
									</span>
								</NavLink>
							</li>,
						);
					}
				}
				return <Nav>{links}</Nav>;
			}
		};
		const ua = window.navigator.userAgent.toLowerCase();
		const is_ie = /trident/gi.test(ua) || /msie/gi.test(ua) || /edge/gi.test(ua);
		const { currentLocale } = this.props;
		return (
			<div className="sidebar menubar" id="appSidebar" data-color="white">
				<div className="sidebar-wrapper" ref="sidebar">
					<div className="profile-info row">
						<div className="col-12">
							{!is_ie ? (
								<a href="/">
									<img alt="" src={logofull} className="img-fluid" />
									<img alt="" src={logomini} className="img-fluid-mobile" />
								</a>
							) : (
								<a href="/">
									<img alt="" src={logoIE} className="img-fluid" />
									<img alt="" src={logomini} className="img-fluid-mobile" />
								</a>
							)}
						</div>
					</div>

					<Nav className="navigation">
						{this.props.routes.map((prop, key) => {
							if (prop.redirect || prop.sidebar === false) return null;
							if (prop.type === 'child') return null;
							if (prop.type === 'navgroup') return <Navmenugroup name={prop.name} key={key} />;
							if (prop.type === 'dropdown')
								return (
									<li
										className={this.state.opendd === prop.name ? 'active' : ''}
										data-toggle="collapse"
										key={key}
									>
										<a
											to={prop.path}
											className="nav-link"
											onClick={() => this.handleOpendd(prop.name)}
										>
											<i className={`${prop.icon}`} />
											<p>
												<FormattedMessage id={`app.sidebar.${prop.name}`} />
											</p>
											<span className="badge">{prop.badge}</span>
											<span className="arrow fa fa-chevron-right" />
										</a>
										{children(prop.name, prop.child)}
									</li>
								);

							if (prop.type === 'dropdown-backup')
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
								<li
									className={this.activeRoute(prop.path)}
									key={key}
									onClick={() => this.handleOpendd(prop.name)}
								>
									<NavLink
										to={prop.hasOwnProperty('defaultPath') ? prop.defaultPath : prop.path}
										className="nav-link"
										activeClassName="active"
									>
										<i className={`${prop.icon}`} />
										<p>
											<FormattedMessage id={`app.sidebar.${prop.name}`} />
										</p>
									</NavLink>
								</li>
							);
						})}
					</Nav>
					<div className="sidebar_info">
						{window.innerWidth > 600 ? (
							<div className="personal__manager">
								<h6>
									<FormattedMessage id={`app.sidebar.personalManager`} />:
								</h6>
								<p>
									<i className="fal fa-user" />
									{Object.keys(managers).includes(currentLocale)
										? managers[currentLocale].name
										: managers.en.name}
								</p>
								<a
									href={`mailto:${
										Object.keys(managers).includes(currentLocale)
											? managers[currentLocale].email
											: managers.en.email
									}`}
								>
									<i className="fal fa-envelope" />
									{Object.keys(managers).includes(currentLocale)
										? managers[currentLocale].email
										: managers.en.email}
								</a>
							</div>
						) : null}
						<div className="social-icons">
							<a href="https://twitter.com/ubex_ai/" target="_blank">
								<i className="fa fa-twitter" />
							</a>
							<a href="https://t.me/UbexAI" target="_blank">
								<i className="fa fa-telegram" />
							</a>
							<a href="https://www.facebook.com/UbexAl/" target="_blank">
								<i className="fa fa-facebook" />
							</a>
							<a href="https://www.youtube.com/c/UbexAI" target="_blank">
								<i className="fa fa-youtube" />
							</a>
							<a href="https://www.linkedin.com/company/ubex-ai" target="_blank">
								<i className="fa fa-linkedin" />
							</a>
						</div>
					</div>
					<span
						style={{
							position: 'relative',
							top: '20px',
							display: 'block',
							fontSize: '10px',
							marginLeft: '25px'
						}}
					>
						VERSION: {VERSION}
					</span>
				</div>
			</div>
		);
	}
}

export default Sidebar;
