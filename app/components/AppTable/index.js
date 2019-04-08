/**
 *
 * AppTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';

/* eslint-disable react/prefer-stateless-function */
class AppTable extends React.PureComponent {
	render() {
		return <BootstrapTable keyField={this.props.keyField} data={this.props.data} columns={this.props.columns} />;
	}
}

AppTable.propTypes = {
	columns: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	defaultSorted: PropTypes.array,
	exportCSV: PropTypes.bool,
	keyField: PropTypes.string,
};

AppTable.defaultProps = {
	keyField: 'id',
	exportCSV: false,
};

export default AppTable;
