import React from 'react';
import {
	Collapse,
	Navbar,
	NavbarBrand,
	Nav,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Container,
	Row,
	Col,
} from 'reactstrap';
import LanguageChanger from 'components/LanguageChanger';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import logofull from '../../assets/img/logo-full.png';
import logomini from '../../assets/img/logo-mini.png';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			userddOpen: false,
			searchOpen: false,
			messagesddOpen: false,
			notificationsddOpen: false,
			color: 'white',
			dropdownOpen: false,
		};
		this.toggle = this.toggle.bind(this);
		this.userddToggle = this.userddToggle.bind(this);
		this.messagesddToggle = this.messagesddToggle.bind(this);
		this.notificationsddToggle = this.notificationsddToggle.bind(this);
		this.searchToggle = this.searchToggle.bind(this);
		this.toggleDropDown = this.toggleDropDown.bind(this);
	}

	toggleDropDown() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
		});
	}

	toggle() {
		if (this.state.isOpen) {
			this.setState({
				color: 'primary',
			});
		} else {
			this.setState({
				color: 'white',
			});
		}
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}

	userddToggle(e) {
		this.setState({
			userddOpen: !this.state.userddOpen,
		});
	}

	searchToggle() {
		this.setState({
			searchOpen: !this.state.searchOpen,
		});
	}

	messagesddToggle(e) {
		this.setState({
			messagesddOpen: !this.state.messagesddOpen,
		});
	}

	notificationsddToggle(e) {
		this.setState({
			notificationsddOpen: !this.state.notificationsddOpen,
		});
	}

	getBrand() {
		return 'Ubex AI';
	}

	openSidebar() {
		document.documentElement.classList.toggle('nav-toggle');
		// todo: сделать рефакторинг - убрать ссылки
		this.refs.sidebarToggle.classList.toggle('toggled');

		// close chat bar if open on smaller screens
		if (window.innerWidth < 993 && this.refs.chatToggle) {
			document.documentElement.classList.remove('nav-toggle-chat');
			this.refs.chatToggle.classList.remove('toggled');
		}
	}

	// function that adds color white/transparent to the navbar on resize (this is for the collapse)
	updateColor() {
		if (window.innerWidth < 993 && this.state.isOpen) {
			this.setState({
				color: 'white',
			});
		} else {
			this.setState({
				color: 'white',
			});
		}
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateColor.bind(this));
	}

	componentDidUpdate(e) {
		if (
			window.innerWidth < 993 &&
			e.history.location.pathname !== e.location.pathname &&
			document.documentElement.className.indexOf('nav-toggle') !== -1
		) {
			document.documentElement.classList.toggle('nav-toggle');
			this.refs.sidebarToggle.classList.toggle('toggled');
		}
		if (
			window.innerWidth < 993 &&
			e.history.location.pathname !== e.location.pathname &&
			document.documentElement.className.indexOf('nav-toggle-chat') !== -1
		) {
			document.documentElement.classList.toggle('nav-toggle-chat');
			this.refs.chatToggle.classList.toggle('toggled');
		}
	}

	render() {
		return (
			<Navbar
				color={this.props.location.pathname.indexOf('full-screen-maps') !== -1 ? 'white' : this.state.color}
				expand="lg"
				className={
					this.props.location.pathname.indexOf('full-screen-maps') !== -1
						? 'navbar-absolute fixed-top'
						: `navbar-absolute fixed-top ${
								this.state.color === 'transparent'
									? 'navbar-transparent '
									: `navbar-${this.state.color}`
						  }`
				}
			>
				<div className="offset-sidebar" />

				<div className="navbar-wrap" id="navbarSupportedContent">
					<div className="navbar-toggle">
						<button
							type="button"
							ref="sidebarToggle"
							className="navbar-toggler"
							onClick={() => this.openSidebar()}
						>
							<i className="fa fa-bars" />
						</button>
					</div>
					<Dropdown
						group
						isOpen={this.state.dropdownOpen}
						size="sm"
						toggle={this.toggleDropDown}
						className="for_mobile"
					>
						<DropdownToggle className="gray-color" caret>Data Mining</DropdownToggle>
						<DropdownMenu>
							<a className="dropdown-item" href="#">
								Trading Desk
							</a>
							<a className="dropdown-item" href="#">
								Data Platform
							</a>
							<a className="dropdown-item" href="https://network.ubex.com">
								Ad Network
							</a>
						</DropdownMenu>
					</Dropdown>
					<ul className="navbar-nav mr-auto buttons__header">
						<li className="nav-item">
							<a href="#" className="adv">
								<i className="fas fa-bullhorn" />
								<span>Trading Desk</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="#" className="dmp">
								<i className="fas fa-users" />
								<span>Data Platform</span>
							</a>
						</li>
						<li className="nav-item active">
							<a href="https://network.ubex.com" className="pub">
								<i className="fas fa-laptop-code" />
								<span>Ad Network</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="https://mining.ubex.com" className="mining active">
								<i className="fas fa-server" />
								<span>Data Mining</span>
							</a>
						</li>
					</ul>
					<ul className="navbar-nav users__header float-right">
						<li className="nav-item nav-pay">
							<Link className="nav-link" to="/app/payments/pay">
								<span className="tab-label">UBEX</span>
								<span className="badge badge-purple">
									<span>0</span>
								</span>
							</Link>
						</li>
						<div className="nav-item">
							<Dropdown
								nav
								isOpen={this.state.userddOpen}
								toggle={e => this.userddToggle(e)}
								className="userdd"
							>
								<DropdownToggle caret nav>
									<i className="fa fa-user header__user" />
									<span>{this.props.userData && this.props.userData.email}</span>
								</DropdownToggle>
								<DropdownMenu right>
									<DropdownItem disabled className="desktop_none">
										<i className="fa fa-user header__user" />
										<span>{this.props.userData && this.props.userData.email}</span>
									</DropdownItem>
									<div className="desktop_none">
										<DropdownItem>
											<li className="nav-item d-xl-block">
												<Link className="nav-link" to="/app/payments/accountbalance">
													<span className="tab-label">UBEX</span>
													<span className="badge badge-purple">
														<span>0</span>
													</span>
												</Link>
											</li>
										</DropdownItem>
									</div>
									<a href={`${PASSPORT_URL}/profile`}>
										<DropdownItem>
											<i className="fa fa-user" href="#!" />
											<FormattedMessage id="app.navbar.profile" />
										</DropdownItem>
									</a>
									<Link to="/app/faq">
										<DropdownItem>
											<i className="fas fa-question-circle" />
											FAQ
										</DropdownItem>
									</Link>
									<a href="/accounts/logout/">
										<DropdownItem>
											<i className="fa fa-lock" /> <FormattedMessage id="app.navbar.logout" />
										</DropdownItem>
									</a>
								</DropdownMenu>
							</Dropdown>
						</div>
						<div className="nav-item">
							<LanguageChanger
								currentLanguage={this.props.currentLocale}
								changeLocale={this.props.changeLocale}
							/>
						</div>
					</ul>
				</div>
			</Navbar>
		);
	}
}

export default Header;
