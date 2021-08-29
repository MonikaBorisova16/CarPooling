import React from 'react'
import axios from 'axios'
import MySnackbar from '../MySnackBar'


class UpdateProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "0888888888",
            errorMessage: "",
            avatar: null
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.fileChange = this.fileChange.bind(this)
        this.uploadAvatar = this.uploadAvatar.bind(this)
    }

    componentDidMount() {
        let self = this;

        axios.get(`http://localhost:8080/api/users/authenticate/me`, this.props.header)
            .then(function (response) {
                const { firstName, lastName, email, phone } = response.data
                self.setState({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone
                })
            })
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = {
            id: this.props.userID,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phone: this.state.phone
        }

        axios.put(`http://localhost:8080/api/users/edit`, data, this.props.header)
            .then(() => {
                this.props.refresh()
                this.props.toggleSnackBar("Profile updated successfully!")
            })
            .catch(error => this.props.toggleSnackBar(error.message))
    }

    handleChange(e) {
        let target = e.target;
        let value = target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });

    }

    fileChange(e) {
        this.setState({
            avatar: e.target.files[0]
        })
    }

    uploadAvatar(e) {
        e.preventDefault()
        const userID = this.props.userID
        const formData = new FormData();
        formData.append('file', this.state.avatar)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        axios.post(`http://localhost:8080/api/users/${userID}/avatar`, formData, { config })
            .then(() => this.props.toggleSnackBar("Avatar uploaded successfully!"))
            .catch(error => this.props.toggleSnackBar(error.response.data.message))
    }

    render() {

        return (
            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">
                    <MySnackbar open={this.props.open} message={this.props.message} handleClose={this.props.handleClose} />

                    <div className="createForm">
                        <div className="header"><h3>Edit your profile</h3></div>
                        <div className="centeredForm">

                            <label >First Name</label>
                            <input type="text" name="firstName" placeholder={this.state.firstName}
                                value={this.state.firstName} onChange={this.handleChange}></input>
                            <label >Last Name</label>
                            <input type="text" name="lastName" placeholder={this.state.lastName}
                                value={this.state.lastName} onChange={this.handleChange}></input>
                            <label >Email</label>
                            <input type="text" name="email" placeholder={this.state.email}
                                value={this.state.email} onChange={this.handleChange}></input>

                            <label >Phone</label>
                            <input type="text" name="phone" placeholder={this.state.phone}
                                value={this.state.phone} onChange={this.handleChange}></input>

                            <form onSubmit={this.uploadAvatar}>
                                <label>Change your avatar</label>
                                <label className="custom-file-upload" htmlFor="file">Upload an avatar</label>
                                <input type="file" id="file" onChange={this.fileChange} />
                                <button type="submit" className="submit">Upload</button>
                            </form>

                        </div>

                        <button className="send" onClick={this.handleSubmit}>Edit Profile</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default UpdateProfile