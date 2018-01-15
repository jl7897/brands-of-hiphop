import React from 'react';
import $ from 'jquery';
import '../style.scss';
import {BarChart} from 'react-easy-chart';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      count: [],
      chart: []
    }
  }

  componentDidMount () {
    $.get('/data')
    .then(obj => {
      var parsed = JSON.parse(obj)
      this.setState({
        count: parsed.empty,
        chart: parsed.chart
      });
    })
  }
  
  render () {
    return (
        <div>
          <h1>Frequency of brands mentioned in the hiptop top 50 chart this week: </h1>
          <BarChart
              height={450}
              width={1050}
              grid
              axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
              axes
              colorBars
              data={this.state.chart}
            />
          <h5 id='x-axis'>Brand Name</h5>
          <h5 id='y-axis'>% of charting songs <br/>that mention brand</h5>
          <p>***Due to the way this data is gathered, some songs may be omitted and therefore numbers may be slightly off***</p>
          <br />
          <p><i>The brands below were included in the search but showed up 0 times</i></p>
          <div>
            {this.state.count.map((brand) => {
                return <span key={brand} className='omitted'>{brand}</span>
            })}
          </div>
        </div>
    )
  }
}





