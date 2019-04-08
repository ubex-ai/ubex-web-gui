import React from 'react';

import logofull from 'assets/img/logo.svg';

class HeaderWelcome extends React.Component {
	render() {
		return (
			<div className="header__wrap">
				<header className="header row justify-content-between">
					<a href="/">
						<img src={logofull} alt="" className="header__logo" />
					</a>
					<div className="header__right">
						<a href="/" className="header__langs">
							<img src="/images/lang_en.png" alt="" />
							EN
						</a>
					</div>
				</header>
			</div>
		);
	}
}

export default HeaderWelcome;
