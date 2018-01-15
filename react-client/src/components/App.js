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
    .then((array) => {
      this.setState({
        chart: JSON.parse(array)
      });
    })
  }
  
  render () {
    return (
        <div>
          <h1>Frequency of brands mentioned in the hiptop top 50 chart this week: </h1>
          <BarChart
              height={300}
              width={700}
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
              var tuple = brand.split(',');
              if (tuple[1] === '0') {
                return <span key={brand} className='omitted'>{tuple[0]}</span>
              }
            })}
          </div>
        </div>
    )
  }
}





