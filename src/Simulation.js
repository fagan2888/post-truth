import React, { Component } from 'react';

import randomgraph from 'randomgraph';

import {
  IDLE, FORWARDED, IGNORED,
  CONSCIOUS, SENSELESS,
  INITIAL, PLAYING, PAUSED,
  FPS,
} from './constants';

import Layout from './components/Layout';
import Graph from './components/Graph';
import Settings from './components/Settings';
import { weightedRandom, rangeBetween, findEdges } from './utils';


function randomConsciousness(avarage) {
  const weight = weightedRandom([
    [avarage, CONSCIOUS],
    [1 - avarage, SENSELESS]
  ]);

  const [first, second] = [
    [0, 0.5],
    [0.5, 1],
  ][weight];
  
  return rangeBetween(first, second);
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleConsciousnessChange = this.handleConsciousnessChange.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.run = this.run.bind(this);
    this.handleReset = this.handleReset.bind(this);
    
    const avarageConsciousness = 0.2;

    const { graphData: graph } = this.props;

    this.state = {
      avarageConsciousness,
      simulationState: INITIAL,
      edges: graph.edges.map(edge => ({
        source: edge['from'],
        target: edge['to'],
        directed: edge['directed'],
      })),
      nodes: graph.nodes.map(
        ({ id, label }) => ({
          id,
          label,
          state: IDLE,
          size: findEdges(graph.edges, id).length,
          consciousness: randomConsciousness(avarageConsciousness),
        })
      ),
    };
  }

  handleConsciousnessChange(value) {
    const consciousness = parseFloat(value);
    this.setState({
      avarageConsciousness: value,
      nodes: this.state.nodes.map(
        node => ({
          ...node,
          consciousness: randomConsciousness(consciousness)
        })
      )
    });
  }

  getNodeById(nodeId) {
    const [node] = this.state.nodes.filter(
      ({ id }) => id === nodeId
    );

    return node;
  }

  run() {
    const { nodes, edges } = this.state;

    const forwardedIds = nodes.filter(
      ({ state }) => state === FORWARDED,
    ).map(
      ({ id }) => id
    );

    const outbound = edges.filter(
      ({ source }) => forwardedIds.indexOf(source.id) > -1
    ).map(
      ({ target }) => target.id
    );

    const inbound = edges.filter(
      ({ target }) => forwardedIds.indexOf(target.id) > -1
    ).map(
      ({ source }) => source.id
    );

    const undirected = outbound.concat(
      inbound
    ).filter(
      nodeId => this.getNodeById(nodeId).state === IDLE
    );

    const updates = {};

    this.setState({
      nodes: nodes.map(
        node => undirected.indexOf(node.id) > -1 ? ({
          ...node,
          state: weightedRandom([
            [node.consciousness, IGNORED],
            [1. - node.consciousness, FORWARDED],
          ]),
        }) : node
      ),
    })

    if (undirected.length) {
      this.timeout = setTimeout(this.run, FPS)
    };
  }

  handlePublish(nodeId) {
    return () => {
      const { nodes } = this.state;
      this.setState({
        simulationState: PLAYING,
        nodes: nodes.map(
          node => node.id === nodeId ? {
            ...node,
            state: FORWARDED,
          } : node
        ),
      }, () => {
        setTimeout(this.run, FPS);
      });
    }
  }

  handleReset() {
    this.setState({
      simulationState: INITIAL,
      nodes: this.state.nodes.map(
        node => ({
          ...node,
          state: IDLE,
        })
      )
    });

    clearTimeout(this.timeout);
  }

  render() {
    const {
      nodes, edges, avarageConsciousness, simulationState
    } = this.state;
    return (
      <Layout>
        <Graph
          nodes={ nodes }
          edges={ edges }
          height={ 600 }
          onPublish={ this.handlePublish }
        />
        <Settings
          avarageConsciousness={ avarageConsciousness }
          onChangeConsciousness={ this.handleConsciousnessChange }
          nodes={ nodes }
          simulationState={ simulationState }
          onReset={ this.handleReset }
        />
      </Layout>
    );
  }
}
