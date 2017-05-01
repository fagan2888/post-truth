import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

import Simulation from './Simulation';
import GraphSelect from './components/GraphSelect';
import Loading from './components/Loading';

const GRAPHS = {
  'celebrities-graph': 'Celebrities',
  'designtennis-graph': 'Design Tennis',
  'npm-graph': 'NPM Graph',
  'refugees-graph': 'Refuuges',
};

const BASE = 'https://graphcommons.github.io/post-truth';

export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      graphData: {},
      graphMeta: {},
      loading: true,
      selectedGraph: 'refugees-graph',
    };

    this.handleGraphChange = this.handleGraphChange.bind(this);
  }

  componentDidMount() {
    this.fetchGraph();
    this.fetchMeta();
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
      `${BASE}/data/${selectedGraph}.json`
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

  fetchMeta() {
    const { selectedGraph } = this.state;

    fetch(
      `${BASE}/data/graphs.json`
    ).then(
      response => 
        response.json()
    ).then(
      response => 
        this.setState({
          graphMeta: response
        })
    );
  }

  render() {
    const { graphData, loading, selectedGraph, graphMeta } = this.state;
    return (
      <div>
        <GraphSelect
          dataset={ GRAPHS }
          value={ selectedGraph }
          meta={ graphMeta[selectedGraph] }
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
