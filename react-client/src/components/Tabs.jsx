import React from 'react';
import moment from 'moment';

class Tabs extends React.Component {
  constructor(props) {
    super(props);


    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(tab) {
    const optionDict = {
      pastDay: { startDate: moment.utc().add(-1, 'days').format('YYYY-MM-DD hh:mm'), endDate: moment.utc().format('YYYY-MM-DD hh:mm') },
      pastWeek: { startDate: moment.utc().add(-1, 'weeks').format('YYYY-MM-DD hh:mm'), endDate: moment.utc().format('YYYY-MM-DD hh:mm') },
      pastMonth: { startDate: moment.utc().add(-1, 'months').format('YYYY-MM-DD hh:mm'), endDate: moment.utc().format('YYYY-MM-DD hh:mm') },
      pastYear: { startDate: moment.utc().add(-1, 'years').format('YYYY-MM-DD hh:mm'), endDate: moment.utc().format('YYYY-MM-DD hh:mm') },
      yearToDate: { startDate: moment.utc().startOf('year').format('YYYY-MM-DD hh:mm'), endDate: moment.utc().format('YYYY-MM-DD hh:mm') },
      All: { startDate: moment.utc('2015-01-01', 'YYYY-MM-DD').format('YYYY-MM-DD hh:mm'), endDate: moment.utc().format('YYYY-MM-DD hh:mm') },
    };
    this.props.handleSelectViewOption(tab, optionDict[tab].startDate, optionDict[tab].endDate);
  }

  render() {
    return (
      <div className='tab-container row'>
          <button className={ this.props.viewOption === 'pastDay' ? 'tab-select' : '' }
                  onClick={() => this.handleClick('pastDay')}>1 day
          </button>

          <button className={ this.props.viewOption === 'pastWeek' ? 'tab-select' : '' }
                  onClick={() => this.handleClick('pastWeek')}>1 week
          </button>

          <button className={ this.props.viewOption === 'pastMonth' ? 'tab-select' : '' }
                  onClick={() => this.handleClick('pastMonth')}>1 month
          </button>

          <button className={ this.props.viewOption === 'pastYear' ? 'tab-select' : '' }
                  onClick={() => this.handleClick('pastYear')}>1 year
          </button>

          <button className={ this.props.viewOption === 'yearToDate' ? 'tab-select' : ''}
                  onClick={() => this.handleClick('yearToDate')}>YTD
          </button>

          <button className={ this.props.viewOption === 'All' ? 'tab-select' : ''}
                  onClick={() => this.handleClick('All')}>All
          </button>
      </div>);
  }
}
export default Tabs;
