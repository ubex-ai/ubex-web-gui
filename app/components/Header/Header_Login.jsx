import React from 'react';

import logofull from '../../assets/img/logo2.png';

class HeaderLogin extends React.Component {
	render() {
		return (
			<header className="header">
				<div className="container-fluid">
					<a href="{{ route('welcome') }}">
						<img src={logofull} alt="" className="header__logo_mob" />
					</a>
					<div className="header__lang">
						<a href="/" className="header__lang_current">
							<img src="/images/lang_en.png" alt="" />
							EN
						</a>
					</div>
				</div>
			</header>
		);
	}
}

export default HeaderLogin;
