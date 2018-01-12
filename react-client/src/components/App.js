import React from 'react';
import $ from 'jquery';
import '../style.scss';
import MenuExampleBasic from './exampleComponent';

export default class App extends React.Component {
  
  render () {
    return (
        <div>
          <MenuExampleBasic />
          <h1>Hello World!</h1>
        </div>
    )
  }
}