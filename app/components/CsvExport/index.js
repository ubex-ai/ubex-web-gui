/**
 *
 * CsvExport
 *
 */

import React from 'react';
import { CSVLink } from 'react-csv/lib';
import moment from 'moment';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class CsvExport extends React.Component {
	generateData(data) {
		const dataArray = data.map(item => ({
			...item,
			id: item.name,
			date: moment(item.date).format('DD.MM.YYYY'),
			name:
				this.props.getName && typeof this.props.getName === 'function'
					? this.props.getName(item.name)
					: item.name,
			groupid:
				this.props.additionalID && typeof this.props.additionalID === 'function'
					? this.props.additionalID(item.name)
					: item.name,
		}));
		return dataArray;
	}

	generateHeader(header) {
		const headerArray = header.map(item => ({ label: item.title, key: item.name }));
		headerArray.unshift({ label: 'ID', key: 'id' });
		if (this.props.additionalHeader) {
			headerArray.push({ label: this.props.additionalHeader, key: 'groupid' });
		}
		return headerArray;
	}

	render() {
		const { header, data, filename } = this.props;
		return data && header ? (
			<CSVLink
				filename={`${filename}.csv`}
				headers={this.generateHeader(header)}
				data={this.generateData(data)}
				target="_blank"
				separator=";"
			>
				<Button size="sm" color="success" className="button-margin-left-10">
					CSV
				</Button>
			</CSVLink>
		) : null;
	}
}

CsvExport.propTypes = {
	header: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	filename: PropTypes.string.isRequired,
	getName: PropTypes.func,
};

export default CsvExport;
