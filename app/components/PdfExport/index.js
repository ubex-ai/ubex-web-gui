/**
 *
 * PdfExport
 *
 */

import React from 'react';
import JSPDF from 'jspdf';
import 'jspdf-autotable';
import PropTypes from 'prop-types';
import Button from 'reactstrap/es/Button';
import moment from 'moment';
import transliterate from 'utils/transliterate';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class PdfExport extends React.Component {
	beautifyKey(item, key) {
		if (key === 'date') {
			return moment(item[key]).format('DD.MM.YYYY');
		}

		if (key === 'name' && this.props.getName && typeof this.props.getName === 'function') {
			return transliterate(this.props.getName(item[key]));
		}

		return item[key];
	}

	savePdf(header, data, filename) {
		const doc = new JSPDF();
		const headArray = header.map(item => item.title);
		headArray.unshift('ID');
		if (this.props.additionalHeader) {
			headArray.push(this.props.additionalHeader);
		}

		const dataArray = data.map(item => [
			item.name,
			...Object.keys(item).map(key => this.beautifyKey(item, key)),
			this.props.additionalID(item.name),
		]);
		doc.autoTable({
			head: [headArray],
			body: dataArray,
		});

		doc.save(`${filename}.pdf`);
	}

	render() {
		const { header, data, filename, getName } = this.props;

		return (
			<Button
				size="sm"
				onClick={() => this.savePdf(header, data, filename)}
				color="success"
				className="button-margin-left-10"
			>
				PDF
			</Button>
		);
	}
}

PdfExport.propTypes = {
	header: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	filename: PropTypes.string.isRequired,
	getName: PropTypes.func,
};

export default PdfExport;
