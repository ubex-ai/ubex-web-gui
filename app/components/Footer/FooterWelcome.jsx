import React from 'react';

class FooterWelcome extends React.Component {
	render() {
		return (
			<footer className="footer">
				<ul className="footer__links row list-unstyled justify-content-between">
					<li>{1900 + new Date().getYear()} (c) Ubex AI AG</li>
					<li>
						Contact us: <a href="mailto:support@ubex.com">support@ubex.com</a>
					</li>
					<li>
						Partners: <a href="mailto:partners@ubex.com">partners@ubex.com</a>
					</li>
					<li>
						Press: <a href="mailto:press@ubex.com">press@ubex.com</a>
					</li>
				</ul>
			</footer>
		);
	}
}

export default FooterWelcome;
