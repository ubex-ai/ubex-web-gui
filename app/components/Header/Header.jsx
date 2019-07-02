import React from 'react';
import { Navbar, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Popover, PopoverBody } from 'reactstrap';
import LanguageChanger from 'components/LanguageChanger';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getUBEXBalance } from 'utils/web3helper';
import WalletConnector from '../WalletConnector';

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
			popoverOpen: false,
			openWalletConnector: false,
			ubexBalance: 0,
		};
		this.toggle = this.toggle.bind(this);
		this.userddToggle = this.userddToggle.bind(this);
		this.messagesddToggle = this.messagesddToggle.bind(this);
		this.notificationsddToggle = this.notificationsddToggle.bind(this);
		this.searchToggle = this.searchToggle.bind(this);
		this.toggleDropDown = this.toggleDropDown.bind(this);
		this.toggle = this.toggle.bind(this);
		this.togglePopover = this.togglePopover.bind(this);
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

	togglePopover() {
		this.setState({
			popoverOpen: !this.state.popoverOpen,
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
		this.setState({ popoverOpen: true });
		window.addEventListener('resize', this.updateColor.bind(this));
		const { selectUbexHash } = this.props;
		const { wallet } = selectUbexHash;
		if (wallet && wallet.hash_code) {
			this.getBalance(wallet.hash_code);
		}
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

	async getBalance(hash) {
		const ua = window.navigator.userAgent.toLowerCase();
		const is_ie = /trident/gi.test(ua) || /msie/gi.test(ua);
		if (!is_ie) {
			const { balance, err } = await getUBEXBalance(hash);
			if (err) {
				console.log(err);
			} else {
				this.setState({ ubexBalance: balance });
			}
		}
	}

	render() {
		console.log(this.props)
		const { display } = this.props.selectUbexPopover;
		const { amount } = this.props.selectAmount && this.props.selectAmount.length ? this.props.selectAmount[0] : '0';
		const { selectUbexHash } = this.props;
		const ua = window.navigator.userAgent.toLowerCase();
		const is_ie = /trident/gi.test(ua) || /msie/gi.test(ua);
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
						<DropdownToggle className="gray-color" caret>
							Trading Desk
						</DropdownToggle>
						<DropdownMenu>
							<a className="dropdown-item" href="#">
								Data Platform
							</a>
							<a className="dropdown-item" href="https://mining.ubex.com">
								Data Mining
							</a>
							<a className="dropdown-item" href="https://network.ubex.com">
								Ad Network
							</a>
						</DropdownMenu>
					</Dropdown>
					<ul className="navbar-nav mr-auto buttons__header">
						<li className="nav-item">
							<a href="https://desk.ubex.com" className="adv active">
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
							<a href="https://mining.ubex.com" className="mining ">
								<i className="fas fa-server" />
								<span>Data Mining</span>
							</a>
						</li>
					</ul>
					<ul className="navbar-nav users__header float-right">
						{document.location.origin !== MINING_URL && (
							<li className="nav-item nav-pay">
								<Link className="nav-link" to="/app/payments/pay">
									<span className="tab-label">USD</span>
									<span className="badge badge-success">
										<span>{amount ? parseInt(amount, 10) : '0'}</span>
									</span>
								</Link>
							</li>
						)}
						<li className="nav-item nav-pay" id="pay-popover">
							<a
								className="nav-link pointer"
								onClick={() => this.setState({ openWalletConnector: true })}
							>
								<span className="tab-label">UBEX</span>
								<span className="badge badge-purple">
									<span>{this.state.ubexBalance}</span>
								</span>
							</a>
						</li>
						{window.innerWidth >= 992 && (
							<Popover
								fade
								placement="bottom"
								isOpen={
									!this.state.openWalletConnector &&
									this.state.popoverOpen &&
									display &&
									NODE_ENV === 'production'
								}
								className="pay-popover"
								target="pay-popover"
								toggle={this.togglePopover}
							>
								<PopoverBody className="pay-popover__body">
									<div className="close-popover">
										<button
											type="button"
											className="close"
											aria-label="Close"
											onClick={() => this.props.setUbexPopover({ display: false })}
										>
											<span aria-hidden="true">×</span>
										</button>
									</div>
									<h6 className="pay-popover__title">Benefits of paying with UBEX</h6>
									<ul className="pay-popover__list">
										<li>Bonus 5% on ad impressions</li>
										<li>No commission</li>
										<li>Cross-Border Payments</li>
										<li>Deferred payment</li>
									</ul>
								</PopoverBody>
							</Popover>
						)}
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
											<li
												className="nav-item d-xl-block"
												onClick={() => this.setState({ openWalletConnector: true })}
											>
												<div className="nav-link">
													<span className="tab-label">UBEX</span>
													<span className="badge badge-purple">
														<span>{this.state.ubexBalance}</span>
													</span>
												</div>
											</li>
										</DropdownItem>
									</div>
									<a href={`${PASSPORT_URL}/profile`}>
										<DropdownItem>
											<i className="fa fa-user" href="#!" />
											<FormattedMessage id="app.navbar.profile" />
										</DropdownItem>
									</a>
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
				{!is_ie && (
					<WalletConnector
						isOpen={this.state.openWalletConnector}
						data={selectUbexHash}
						updateUbex={values => this.props.updateUbex(values)}
						onCancel={() => this.setState({ openWalletConnector: false })}
					/>
				)}
			</Navbar>
		);
	}
}

export default Header;
