import React, { Component } from 'react';

import Simulation from './Simulation';
import GraphSelect from './components/GraphSelect';
import Loading from './components/Loading';

const GRAPHS = {
  'celebrities-graph.json': 'Celebrities',
  'designtennis-graph.json': 'Design Tennis',
  'npm-graph.json': 'NPM Graph',
  'refugees-graph.json': 'Refuuges',
};

export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      graphData: null,
      loading: true,
      selectedGraph: 'refugees-graph.json',
    };

    this.handleGraphChange = this.handleGraphChange.bind(this);
  }

  componentDidMount() {
    this.fetchGraph();
  }

  handleGraphChange(event) {
    this.setState({
      loading: true,
      selectedGraph: event.target.value,
    }, this.fetchGraph);
  }

  fetchGraph() {
    const { selectedGraph } = this.state;

    fetch(
       `/data/${selectedGraph}`
    ).then(
      response => 
        response.json()
    ).then(
      response => 
        this.setState({
          graphData: response.graph,
          loading: false,
        })
    );
  }

  render() {
    const { graphData, loading, selectedGraph } = this.state;
    return (
      <div>
        <GraphSelect
          dataset={ GRAPHS }
          value={ selectedGraph }
          onChange={ this.handleGraphChange }
        />
        {
          loading
            ? <Loading />
            : <Simulation graphData={ graphData } />
        }
      </div>
    );
  }
}
