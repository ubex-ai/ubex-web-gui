/**
 *
 * Pagination
 *
 */

import React from 'react';
import { Col, Pagination, PaginationItem, PaginationLink, Row, Input } from 'reactstrap';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class RenderPagination extends React.Component {
	render() {
		const { data, changePage, changeItemsCount } = this.props;
		const { page, pageSize, total_pages } = data;
		return (
			<Row className="margin-0">
				<Col>
					<Pagination aria-label="Page navigation" className="float-right">
						<Input
							type="select"
							name="selectItems"
							className="mr-2 border-left-select"
							defaultValue={parseInt(pageSize, 10)}
							onChange={e => changeItemsCount(e.target.value)}
						>
							<option value="10">10</option>
							<option value="15">15</option>
							<option value="20">20</option>
							<option value="25">25</option>
						</Input>
						<PaginationItem disabled={page === 1} key={-1}>
							<PaginationLink first href="#" onClick={() => changePage(1)} />
						</PaginationItem>
						<PaginationItem onClick={() => changePage(page - 1)} disabled={page === 1} key={0}>
							<PaginationLink previous href="#" />
						</PaginationItem>
						{(() => {
							const options = [];

							for (let i = 1; i <= total_pages; i++) {
								options.push(
									<PaginationItem active={page === i} key={i} disabled={total_pages === 1}>
										<PaginationLink href="#" onClick={() => changePage(i)}>
											{i}
										</PaginationLink>
									</PaginationItem>,
								);
							}

							return options;
						})()}
						<PaginationItem disabled={parseInt(page, 10) === parseInt(total_pages, 10)} key={total_pages}>
							<PaginationLink next href="#" onClick={() => changePage(page + 1)} />
						</PaginationItem>
						<PaginationItem disabled={parseInt(page, 10) === parseInt(total_pages, 10)} key={total_pages+1}>
							<PaginationLink last href="#" onClick={() => changePage(total_pages)} />
						</PaginationItem>
					</Pagination>
				</Col>
			</Row>
		);
	}
}

RenderPagination.propTypes = {
	data: PropTypes.shape({
		data: PropTypes.array.isRequired,
		page: PropTypes.number.isRequired,
		pageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		total_pages: PropTypes.number.isRequired,
	}),
	changePage: PropTypes.func.isRequired,
	changeItemsCount: PropTypes.func.isRequired,
};

export default RenderPagination;
