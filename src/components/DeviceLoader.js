import Inferno from 'inferno'
import Component from 'inferno-component'
import {connect} from 'cerebral/inferno'
import {state} from 'cerebral/tags'

export default connect({
  media: state`useragent.media`
},
  class DeviceLoader extends Component {
    constructor (props) {
      super(props)

      this.state = {
        isLoading: true,
        device: null
      }
    }
    componentDidMount () {
      this.loadDevice()
        .then((module) => {
          this.setState({
            isLoading: false,
            device: module.default
          })
        })
    }
    loadDevice () {
      if (this.props.media.unsupported) {
        return import('./Unsupported')
      } else if (this.props.media.desktop) {
        return import('./Desktop')
      } else {
        return import('./Mobile')
      }
    }
    componentDidUpdate (prevProps, prevState) {
      if (!prevState.device && this.state.device) {
        document.querySelector('#loader').style.display = 'none'
      }
      if (prevProps.media !== this.props.media) {
        this.setState({
          isLoading: true
        })

        this.loadDevice()
          .then((module) => {
            this.setState({
              isLoading: false,
              device: module.default
            })
          })
      }
    }
    render () {
      if (this.state.isLoading) {
        return null
      }

      var Device = this.state.device

      return <Device />
    }
  }
)
