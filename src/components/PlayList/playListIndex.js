import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// import PlayListsCreated from './playListsCreated'
import { playListIndex, playListCreate } from '../../api/playList'
import './playList.scss'

const createPlayListStyle = {
  color: 'red'
}

class Playlists extends Component {
  constructor (props) {
    super(props)
    this.state = {
      playlists: [],
      playlist: {
        title: ''
      }
    }
  }

  handleChange = event => this.setState({
    [event.target.name]: event.target.value
  })
  componentDidMount () {
    const { user } = this.props
    playListIndex(user)
      .then(res => {
        this.setState({ playlists: res.data.playlists })
      })
  }
    handleInputChange = (event) => {
      event.persist()

      this.setState(prevState => {
        const updatedField = {
          [event.target.name]: event.target.value
        }
        const updatedData = Object.assign({}, prevState.playlist, updatedField)
        return { playlist: updatedData }
      })
    }

    onPlayListCreate = (event) => {
      event.preventDefault()

      const { msgAlert, user, history } = this.props

      playListCreate(this.state.playlist, user)

        // giving playListIndex the parameters of (this.props.user)
        .then(() => playListIndex(this.props.user))

        // getting the res and setting the state of playlists to res.data.playlists
        .then(res => {
          // console.log('setState playlists ', res.data.playlists)
          return this.setState({ playlists: res.data.playlists, playlist: { title: '' } })
        })

        // showing the message alert
        .then(() => msgAlert({
          heading: 'Playlist Created',
          message: messages.createPlaylistSuccess,
          variant: 'success'
        }))

        .then(() => history.push('/playlistsCreated'))

        // in case of an error clear the form and show the rror message alert
        .catch(error => {
          this.setState({ playlist: {
            title: '' } })
          msgAlert({
            heading: 'Playlist Creation Failed ' + error.message,
            message: messages.createPlaylistFailure,
            variant: 'danger'
          })
        })
    }

    render () {
      // console.log('render playlists ', this.state.playlists)
      return (
        <div className="row">
          <Link to="/homepage" className="btn btn-secondary backButton">{'<-Back'}</Link>
          <div className="col-sm-10 col-md-8 mx-auto mt-5">
            <h3 className="createPlaylistStyle" style={createPlayListStyle}>Create a playlist</h3>
            <Form onSubmit={this.onPlayListCreate}>
              <Form.Group controlId="title">
                <Form.Control
                  required
                  type="text"
                  name="title"
                  placeholder="Enter Your Playlist Name"
                  value={this.state.playlist.title}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </div>
        </div>
      )
    }
}

export default withRouter(Playlists)
