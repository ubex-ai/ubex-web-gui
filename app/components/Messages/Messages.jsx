import React from 'react';
import { DropdownMenu, DropdownItem } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types';

class Message extends React.Component {
	render() {
		const messagesList = [];
		for (let i = 0; i < this.props.messages.length; i++) {
			messagesList.push(
				<DropdownItem tag="a" className={this.props.messages[i].type} key={i}>
					<div className="user-img">
						{/*<img*/}
							{/*src={this.props.messages[i].avatar}*/}
							{/*alt="user avatar"*/}
							{/*className="rounded-circle img-inline"*/}
						{/*/>*/}
					</div>
					<div className="user-info">
						<span className="name">
							<strong>{this.props.messages[i].name}</strong>
							<span className="time small"> - {this.props.messages[i].time}</span>
							<span data-status={this.props.messages[i].status} className="profile-status float-right" />
						</span>
						<span className="desc small">{this.props.messages[i].msg}</span>
					</div>
				</DropdownItem>,
			);
		}
		return (
			<DropdownMenu>
				{messagesList}
				<DropdownItem className="all">
					<a href="#!">Read All</a>
				</DropdownItem>
			</DropdownMenu>
		);
	}
}

Message.propTypes = {
	messages: PropTypes.arrayOf(PropTypes.object),
};

export default Message;
