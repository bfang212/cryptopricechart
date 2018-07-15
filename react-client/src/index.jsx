import React from 'react';
import axios from 'axios';
import moment from 'moment';
import ReactDOM from 'react-dom';
import './styles/main.css';
import LineChart from './components/LineChart.jsx';
import Box from './components/Box.jsx';
import Tabs from './components/Tabs.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      coin: 'Ethereum',
      hoverLoc: null,
      activePoint: null,
      viewOption: null,
      startDate: moment.utc().startOf('year').format('YYYY-MM-DD hh:mm'),
      endDate: moment.utc().format('YYYY-MM-DD hh:mm'),
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectCoin = this.selectCoin.bind(this);
    this.handleChartHover = this.handleChartHover.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSelectViewOption = this.handleSelectViewOption.bind(this);
    this.handleSelectTab = this.handleSelectTab.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit() {
    axios.get('/prices', {
      params: {
        coin: this.state.coin,
        startDate: this.state.startDate || moment.utc().startOf('year').format('YYYY-MM-DD hh:mm'),
        endDate: this.state.endDate || moment.utc().format('YYYY-MM-DD hh:mm'),
      },
    })
      .then(({ data }) => {
        this.setState({
          data,
        });
      });
  }

  handleSearch() {
    this.setState(
      { viewOption: null },
      this.handleSubmit,
    );
  }

  selectCoin(coin) {
    this.setState({
      coin,
      viewOption: null,
      startDate: moment.utc().startOf('year').format('YYYY-MM-DD hh:mm'),
      endDate: moment.utc().format('YYYY-MM-DD hh:mm'),
    }, this.handleSubmit);
  }

  onChange(e) {
    if (e.target.name === 'startDate') {
      let startDate = e.target.value <= moment.utc('2015-01-01').format('YYYY-MM-DD') ? moment.utc('2015-01-01').format('YYYY-MM-DD hh:mm') : e.target.value;
      startDate = startDate >= this.state.endDate ? moment.utc(this.endDate).add(-1, 'days').format('YYYY-MM-DD hh:mm') : startDate;
      this.setState({
        startDate,
      });
    }
    if (e.target.name === 'endDate') {
      let endDate = e.target.value >= moment.utc().format('YYYY-MM-DD') ? moment.utc().format('YYYY-MM-DD hh:mm') : e.target.value;
      endDate = endDate <= this.state.startDate ? moment.utc(this.startDate).add(1, 'days').format('YYYY-MM-DD hh:mm') : endDate;
      this.setState({
        endDate,
      });
    }
  }

  handleChartHover(hoverLoc, activePoint) {
    this.setState({
      hoverLoc,
      activePoint,
    });
  }

  handleSelectViewOption(tab, startDate, endDate) {
    this.setState({
      startDate,
      endDate,
    }, () => {
      this.handleSubmit();
      this.handleSelectTab(tab);
    });
  }

  handleSelectTab(tab) {
    this.setState({
      viewOption: tab,
    });
  }

  render() {
    return (
      <div>
        <div className='row'>
          <h1>{this.state.coin} Price Chart</h1>
        </div>
        <br/>
        <br/>
        <div className='row'>
          <button className='btn-coin' onClick={() => this.selectCoin('Bitcoin')}>Bitcoin</button>
          <button className='btn-coin' onClick={() => this.selectCoin('Ethereum')}>Ethereum</button>
          <button className='btn-coin' onClick={() => this.selectCoin('Litecoin')}>Litecoin</button>
          <label className='inputtext'>From</label>
          <input type='date'
            className='datefield'
            name="startDate"
            value={moment.utc(this.state.startDate, 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD')}
            onChange={this.onChange}/>
            <label className='inputtext'>To</label>
            <input type='date'
              name='endDate'
              className='datefield'
              value={moment.utc(this.state.endDate, 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD')}
              onChange={this.onChange}/>
            <button className='btn-submit'onClick={() => this.handleSearch()}>Submit</button>
        </div>


        <Tabs handleSelectViewOption={this.handleSelectViewOption}
              handleSelectTab={this.handleSelectTab}
              viewOption={this.state.viewOption}
        />
        <div className='row'>
          <div className='popup'>
            {this.state.hoverLoc ? <Box hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint}/> : null}
          </div>
        </div>

        <div className='row'>
          {this.state.data.length > 0 ? <LineChart data={this.state.data} onChartHover={this.handleChartHover}/> : null}
        </div>

        <div className='row'>
          <div id="api-footer"> Powered by <a href="https://min-api.cryptocompare.com/">CryptoCompare</a></div>
        </div>
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
