/**
 *
 * CampaignCreativeTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import {
	SortingState,
	IntegratedSorting,
	PagingState,
	IntegratedPaging,
	DataTypeProvider,
} from '@devexpress/dx-react-grid';
import { Button } from 'reactstrap';
import InlineEditField from 'components/InlineEditField';
import {
	Grid,
	Table,
	TableHeaderRow,
	PagingPanel,
	TableFixedColumns,
	TableColumnResizing,
	ColumnChooser,
	TableColumnVisibility,
	Toolbar,
} from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import messages from '../../messages';
import validateInteger from 'utils/validateInteger';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import LinkButton from 'components/LinkButton';
import moment from 'moment';
import _ from 'lodash';
import validateFloat from '../../../../utils/validateFloat';

const EditableFormatter = ({ value, row }, props) => (
	<div>
		<span className="mr-1" style={{ textTransform: 'uppercase' }}>
			({row.cpm_select})
		</span>
		$
		<InlineEditField
			size="xs"
			type="text"
			value={value}
			onSave={val => {
				console.log(val);
			}}
		/>
	</div>
);

const EditableNameFormatter = ({ value, row }, props) => (
	<Link to={`/app/creative/${row.creative_type}/${row.id}`}>{row.data.name}</Link>
);

const EditableCPMFormatter = ({ value, row }, props) => (
	<div className="flex-center">
		<span>{row.data && row.data.cpm_type === 1 ? 'Fixed ' : 'Max '}$</span>
		<InlineEditField
			size="xs"
			type="text"
			value={row.data ? row.data.cpm : null}
			onSave={val => {
				console.log(val);
				props.changeCreativeCPM(row.id, val);
			}}
			validation={val => validateFloat(val)}
		/>
	</div>
);

const EditableDateFormatter = ({ value, row }, props) => (
	<InlineEditField
		size="xs"
		type="date"
		value={value}
		onSave={val => {
			console.log(val);
		}}
	/>
);

const DateEndFormatter = ({ value, row }, props) => {
	const date = _.find(props.creativesWithDates, { value: row.id });
	return (
		<InlineEditField
			size="xs"
			type="date"
			value={date && date.end_date ? date.end_date : 'unlimited'}
			startDate={date && date.start_date ? date.start_date : null}
			onSave={val => {
				console.log(val);
				props.changeCreativeEndDate(row.id, val);
			}}
		/>
	);
};

const DateStartFormatter = ({ value, row }, props) => {
	const date = _.find(props.creativesWithDates, { value: row.id });
	return (
		<InlineEditField
			size="xs"
			type="date"
			value={date && date.start_date ? date.start_date : 'unlimited'}
			endDate={date && date.end_date ? date.end_date : null}
			onSave={val => {
				console.log(val);
				props.changeCreativeStartDate(row.id, val);
			}}
		/>
	);
};
const TypeFormatter = ({ value, row }, props) => <div style={{ textTransform: 'capitalize' }}>{row.creative_type}</div>;

const IDFormatter = ({ value, row }, props) => <div>{row && row.id ? row.id : null}</div>;

const SettingsFormatter = ({ value, row }, props) => {
	if (props.data) {
		const entry = props.data.find(c => c.id === value);
		if (entry.loading) {
			return <span>loading</span>;
		}
	}
	return (
		<span>
			<LinkButton
				key="preview"
				to={`/app/creative-banners/${row.id}`}
				className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
			>
				<i className="fas fa-search" />
			</LinkButton>
			<Button
				key="remove"
				onClick={() => props.onClickRemoveEntry(value)}
				className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
			>
				<i className="fas fa-trash" />
			</Button>
		</span>
	);
};

const getRowId = row => row.id;
const SettingsProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => SettingsFormatter(fCProps, props)} {...props} />
);

const DateStartProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => DateStartFormatter(fileProps, props)} {...props} />
);

const DateEndProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => DateEndFormatter(fileProps, props)} {...props} />
);

const TypeProvider = props => (
	<DataTypeProvider formatterComponent={typeProps => TypeFormatter(typeProps, props)} {...props} />
);

const EditableProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => EditableFormatter(fCProps, props)} {...props} />
);

const EditableDateProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => EditableDateFormatter(fCProps, props)} {...props} />
);

const EditableNameProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => EditableNameFormatter(fCProps, props)} {...props} />
);

const EditableCPMProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => EditableCPMFormatter(fCProps, props)} {...props} />
);

const IDProvider = props => <DataTypeProvider formatterComponent={fCProps => IDFormatter(fCProps, props)} {...props} />;
class CampaignCreativeTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: [
				{
					cpm: 10,
					cpm_type: 1,
					creative_type: 'display',
					id: 1,
					name: 'Display Creative',
					type: 'html5',
				},
			],
			columns: [
				{ name: 'data.id', title: 'ID' },
				{ name: 'data.name', title: this.props.intl.formatMessage(messages.name) },
				{ name: 'creative_type', title: this.props.intl.formatMessage(messages.type) },
				// { name: 'status', title: this.props.intl.formatMessage(messages.status) },
				{ name: 'data.cpm', title: 'CPM' },
				{ name: 'data.startDate', title: this.props.intl.formatMessage(messages.startDate) },
				{ name: 'data.endDate', title: this.props.intl.formatMessage(messages.endDate) },
				{ name: 'id', title: this.props.intl.formatMessage(messages.settings) },
				/* { name: 'spend', title: this.props.intl.formatMessage(messages.spend) },
				{ name: 'impressions', title: this.props.intl.formatMessage(messages.impressions) },
				{ name: 'clicks', title: this.props.intl.formatMessage(messages.clicks) },
				{ name: 'eCPM', title: 'eCPM' },
				{ name: 'winrate', title: 'Win rate' },
				{ name: 'start', title: this.props.intl.formatMessage(messages.startDate) },
				{ name: 'end', title: this.props.intl.formatMessage(messages.endDate) },
				{ name: 'id', title: this.props.intl.formatMessage(messages.settings) }, */
			],
			tableColumnExtensions: [
				{ columnName: 'data.name', width: 160 },
				{ columnName: 'data.id', width: 80 },
				{ columnName: 'creative_type', width: 120 },
				{ columnName: 'data.cpm', width: 150 },
				{ columnName: 'data.startDate', width: 150 },
				{ columnName: 'data.endDate', width: 150 },
				{ columnName: 'id', width: 100 },
				/* { columnName: 'eCPM', width: 120 },
				{ columnName: 'winrate', width: 120 },
				{ columnName: 'start', width: 120 },
				{ columnName: 'end', width: 120 },
				{ columnName: 'spend', width: 120 },
				{ columnName: 'impressions', width: 120 },
				{ columnName: 'clicks', width: 120 },
				{ columnName: 'status', width: 120 },
				{ columnName: 'id', width: 120 }, */
			],
			sorting: [{ columnName: 'created', direction: 'desc' }],
			startDate: ['data.startDate'],
			endDate: ['data.endDate'],
			idColumn: ['data.id'],
			nameColumn: ['data.name'],
			typeColumn: ['creative_type'],
			cpmColumn: ['data.cpm'],
			cpmTypeColumn: ['data.cpm_type'],
			settingsColumn: ['id'],
			statusColumn: ['status'],
			editableColumn: ['cpm'],
			editableDateColumn: ['start', 'end'],
			defaultHiddenColumnNames: ['clicks', 'impressions', 'eCPM', 'status'],
			leftColumns: ['name'],
			tableColumnVisibilityColumnExtensions: [
				{ columnName: 'name', togglingEnabled: false },
				{ columnName: 'id', togglingEnabled: false },
			],
			rightColumns: ['id'],
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });
	}

	render() {
		const {
			sorting,
			columns,
			settingsColumn,
			statusColumn,
			tableColumnExtensions,
			nameColumn,
			cpmColumn,
			typeColumn,
			idColumn,
			startDate,
			endDate,
			cpmTypeColumn,
			editableColumn,
			editableDateColumn,
			defaultHiddenColumnNames,
			tableColumnVisibilityColumnExtensions,
			leftColumns,
			rightColumns,
			rows,
		} = this.state;
		const { data } = this.props;
		return (
			<div className="table__card">
				{data && (
					<Grid rows={data} columns={columns}>
						<Table columnExtensions={tableColumnExtensions} />
						<TableHeaderRow /* showSortingControls */ />
						<EditableNameProvider for={nameColumn} {...this.props} />
						<EditableCPMProvider for={cpmColumn} {...this.props} />
						<TypeProvider for={typeColumn} {...this.props} />
						<SettingsProvider for={settingsColumn} {...this.props} />
						<IDProvider for={idColumn} {...this.props} />
						<DateStartProvider for={startDate} {...this.props} />
						<DateEndProvider for={endDate} {...this.props} />
					</Grid>
				)}
			</div>
		);
	}
}

CampaignCreativeTable.propTypes = {
	intl: intlShape.isRequired,
	data: PropTypes.array,
};

export default injectIntl(CampaignCreativeTable);
