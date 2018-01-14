import React from 'react';
import $ from 'jquery';
import '../style.scss';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      count: []
    }
  }

  componentDidMount () {
    $.get('/data')
    .then((array) => {
      this.setState({
        count: JSON.parse(array)
      })
    })
  }
  
  render () {
    return (
        <div>
          <h1>Frequency of brands mentioned in the hiptop top 50 chart: </h1>
          {this.state.count.map((brand) => {
            var tuple = brand.split(',');
            return <p key={brand}><strong>{tuple[0]}: </strong>{tuple[1]}</p>
          })}
          <p>***Due to the way this data is gathered, some songs may be omitted and therefore numbers may be slightly off***</p>
        </div>
    )
  }
}