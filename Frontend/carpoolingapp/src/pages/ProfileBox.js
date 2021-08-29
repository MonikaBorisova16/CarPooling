import React from 'react'
import '../styles/profilebox.css'
import axios from 'axios';
import DefaultAvatar from '../images/defaultavatar.png'

class ProfileBox extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            avatarURL: DefaultAvatar,
        }
        this.getAvatar = this.getAvatar.bind(this)
    }

    componentDidMount() {
        this.getAvatar()
    }

    getAvatar() {
        axios.get(this.props.userData.userDetails.avatarUri)
            .then(() => this.setState({ avatarURL: this.props.userData.userDetails.avatarUri }))
            .catch(error => { })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="profilebox">
                <img src={this.state.avatarURL} alt="profile"></img>
                <p>{this.props.userData.userDetails.firstName} {this.props.userData.userDetails.lastName}</p>
            </div>
        )
    }
}

export default ProfileBox;