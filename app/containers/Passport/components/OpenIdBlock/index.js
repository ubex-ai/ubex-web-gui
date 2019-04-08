/**
 *
 * OpenIdBlock
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

import MetamaskLogo from 'assets/img/logos/logo_metamask.png';
import CivicLogo from 'assets/img/logos/logo_civic.png';
import FacebookLogo from 'assets/img/logos/logo_facebook.png';
import GoogleLogo from 'assets/img/logos/logo_google.png';
import messages from './messages';

function OpenIdBlock() {
	return (
		<section className="login">
			<h2>OR</h2>

			<div className="install_metamask sample_report sample_report2 sample_report3" style={{ display: 'none' }}>
				<p className="sample_report__p1">
					<FormattedMessage {...messages.metamaskText} />
				</p>
				<p className="sample_report__p2">
					Check this{' '}
					<a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
						link
					</a>{' '}
					and reload this page after installing.
				</p>
			</div>

			<ul className="login__list list-unstyled row justify-content-center">
				<li className="col">
					<a href="#" className="login__list_a js_metamask_signin" />
					<div className="login__list_a" />
					<span className="login__list_more">coming soon</span>
					<p className="login__list_img">
						<img src={MetamaskLogo} alt="" />
					</p>
					<p className="login__list_name">Metamask</p>
				</li>
				<li className="col">
					<a href="#" className="login__list_a js_metamask_signin" />
					<div className="login__list_a" />
					<span className="login__list_more">coming soon</span>
					<p className="login__list_img">
						<img src={CivicLogo} alt="" />
					</p>
					<p className="login__list_name">Civic</p>
				</li>
				<li className="col">
					<a href="#" className="login__list_a js_metamask_signin" />
					<div className="login__list_a" />
					<span className="login__list_more">coming soon</span>
					<p className="login__list_img">
						<img src={FacebookLogo} alt="" />
					</p>
					<p className="login__list_name">Facebook</p>
				</li>
				<li className="col">
					<a href="#" className="login__list_a js_metamask_signin" />
					<div className="login__list_a" />
					<span className="login__list_more">coming soon</span>
					<p className="login__list_img">
						<img src={GoogleLogo} alt="" />
					</p>
					<p className="login__list_name">Google</p>
				</li>
			</ul>
			<p className="form_side__remember">
				or use <Link to="/dashboard">Ubex Demo-mode</Link>
			</p>
		</section>
	);
}

OpenIdBlock.propTypes = {};

export default OpenIdBlock;
