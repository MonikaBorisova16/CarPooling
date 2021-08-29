import React from 'react'
import axios from 'axios';
import moment from 'moment'
import DefaultAvatar from '../images/defaultavatar.png'

class Comment extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            author: {},
            avatarUrl: DefaultAvatar
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:8080/api/users/getID/${this.props.comment.authorID}`, this.props.header)
            .then(response => {
                this.setState({
                    author: response.data
                })
            })

        // axios.get(this.props.comment.author.avatarUri)
        // .then(()=>this.setState({avatarUrl: this.props.comment.author.avatarUri}))
        // .catch(error=>{})
    }

    render() {
        const data = moment(this.props.comment.createdAt)
        return (
            <div className="comment">
                <img src={this.state.avatarUrl} alt="commentator"></img>
                <div className="comment-head">
                    <h4>{this.state.author.firstName} {this.state.author.lastName}</h4>
                    <h6>{data.fromNow()}</h6>
                </div>
                <div className="comment-body">
                    <p>{this.props.comment.message}</p>
                </div>
            </div>
        )
    }

}

export default Comment;