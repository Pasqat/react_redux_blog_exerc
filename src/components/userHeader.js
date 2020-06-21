import React from "react";
import { connect } from "react-redux";

class UserHeader extends React.Component {
  // componentDidMount() {
  //   this.props.fetchUser(this.props.userId);
  //Ho no, 10 richieste per singolo userId
  // }

  render() {
    const { user } = this.props;

    if (!user) {
      return (
        <div className="ui placeholder">
          <div className="short line"></div>
        </div>
      );
    }
    return <div className="header">{user.name}</div>;
  }
}

// * abbiamo spostato state.users.find((user) => user.id === ownProps.userId qui
// * perchè il componente deve occuparsi di mostrare solo un nome per volta
// * e non ha bisogno di tutta la lista
const mapStateToProps = (state, ownProps) => {
  return { user: state.users.find((user) => user.id === ownProps.userId) };
};

export default connect(mapStateToProps)(UserHeader);
