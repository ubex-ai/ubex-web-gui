/**
 * CounterCodeCard
 */
import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormattedMessage } from 'react-intl';
import { Input, Button, FormGroup } from 'reactstrap';
import CodeMirror from 'react-codemirror';

class CodeCard extends React.Component {
	state = {
		copied: false,
	};

	render() {
		const { embeddedScript } = this.props;
		return (
			<FormGroup>
				<div className="form-group">
					{embeddedScript && (
						<CopyToClipboard text={embeddedScript} onCopy={() => this.setState({ copied: true })}>
							<Button color="info">
								<FormattedMessage id={`app.common.${this.state.copied ? 'copied' : 'copy'}`} />
							</Button>
						</CopyToClipboard>
					)}
				</div>
				{embeddedScript ? (
					<CodeMirror
						className="embeddedCode"
						value={embeddedScript}
						onChange={this.updateBackFillCode}
						options={{ lineNumbers: false, mode: 'htmlembedded', readOnly: true }}
					/>
				) : null}
			</FormGroup>
		);
	}
}
CodeCard.defaultProps = {
	embeddedScript: false,
};
CodeCard.propTypes = {
	embeddedScript: PropTypes.string,
};

export default CodeCard;
