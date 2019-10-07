/**
 *
 * ExcelExport
 *
 */

import React from 'react';
import XLSX from 'xlsx';
import ExportSheet from 'react-xlsx-sheet/es/export-sheet';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import moment from 'moment';

// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class ExcelExport extends React.Component {
	generateData(data) {
		return data.map(item => ({
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
	}

	generateHeader(header) {
		const headerArray = header.map(item => ({ title: item.title, dataIndex: item.name }));
		headerArray.unshift({ title: 'ID', dataIndex: 'id' });
		if (this.props.additionalHeader) {
			headerArray.push({ title: this.props.additionalHeader, dataIndex: 'groupid' });
		}
		return headerArray;
	}

	render() {
		const { header, data, filename } = this.props;
		return (
			<ExportSheet
				header={this.generateHeader(header)}
				dataSource={this.generateData(data)}
				fileName={filename}
				xlsx={XLSX}
			>
				<Button size="sm" color="success" className="button-margin-left-10">
					XLSX
				</Button>
			</ExportSheet>
		);
	}
}

ExcelExport.propTypes = {
	header: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	filename: PropTypes.string.isRequired,
	getName: PropTypes.func,
};

export default ExcelExport;
