/**
 *
 * SitesTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import AppTable from 'components/AppTable';
import messages from './messages';

function SitesTable(props) {
	return (
		<div>
			<AppTable
				data={props.data}
				keyField="site"
				columns={[
					{
						dataField: 'site',
						text: 'Site',
					},
					{
						dataField: 'earnings',
						text: 'Estimated earnings',
					},
					{
						dataField: 'pageViews',
						text: 'Page views',
					},
					{
						dataField: 'clicks',
						text: 'Clicks',
					},
				]}
			/>
		</div>
	);
}

SitesTable.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			site: PropTypes.string.isRequired,
			earnings: PropTypes.number.isRequired,
			pageViews: PropTypes.number.isRequired,
			clicks: PropTypes.number.isRequired,
		}),
	).isRequired,
};

export default SitesTable;
