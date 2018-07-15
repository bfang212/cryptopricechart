import React from 'react';
import moment from 'moment';
import '../styles/main.css';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverLoc: null,
      activePoint: null,
    };

    this.getX = this.getX.bind(this);
    this.getY = this.getY.bind(this);
    this.getSvgX = this.getSvgX.bind(this);
    this.getSvgY = this.getSvgY.bind(this);
    this.makeArea = this.makeArea.bind(this);
    this.makePath = this.makePath.bind(this);
    this.makeAxis = this.makeAxis.bind(this);
    this.makeLabels = this.makeLabels.bind(this);
    this.stopHover = this.stopHover.bind(this);
    this.makeActivePoint = this.makeActivePoint.bind(this);
    this.getCoords = this.getCoords.bind(this);
    this.createLine = this.createLine.bind(this);
  }

  // for svg component, the <path> element defines our line and the shaded area beneath
  // d attribute is a string containing instruction of how the points connect to line
  // M means 'move to/start at'
  // L means 'draw a line to'
  // Z means 'end'
  // exp: <path d="M 10 10 L 20 20 z"/>
  // start at coordinate(10,10)
  // draw a line to (20,20) and end
  
  // get x & y and max and min
  getX() {
    const { data } = this.props;
    return {
      min: data[0].count,
      max: data[data.length - 1].count,
    };
  }

  getY() {
    const { data } = this.props;
    return {
      min: data.reduce((min, p) => (p.rawPrice < min ? p.rawPrice : min), data[0].rawPrice),
      max: data.reduce((max, p) => (p.rawPrice > max ? p.rawPrice : max), data[0].rawPrice),
    };
  }

  // get coordinates in svg
  getSvgX(x) {
    const { svgWidth, yLabelSize } = this.props;
    return yLabelSize + (x / this.getX().max * (svgWidth - yLabelSize));
  }

  getSvgY(y) {
    const { svgHeight, xLabelSize } = this.props;
    const gY = this.getY();
    return ((svgHeight - xLabelSize) * gY.max - (svgHeight - xLabelSize) * y) / (gY.max - gY.min);
  }

  // build the shade area below the line
  makeArea() {
    const { data } = this.props;
    let pathD = `M ${this.getSvgX(data[0].count)} ${this.getSvgY(data[0].rawPrice)} `;

    pathD += data.map(point => `L ${this.getSvgX(point.count)} ${this.getSvgY(point.rawPrice)} `).join('');

    const x = this.getX();
    const y = this.getY();
    pathD += `L ${this.getSvgX(x.max)} ${this.getSvgY(y.min)} `
    + `L ${this.getSvgX(x.min)} ${this.getSvgY(y.min)} `;

    return <path className="linechart-area" d={pathD} />;
  }

  // build the line
  makePath() {
    const { data, color } = this.props;
    let pathD = `M ${this.getSvgX(data[0].count)} ${this.getSvgY(data[0].rawPrice)} `;

    pathD += data.map(point => `L ${this.getSvgX(point.count)} ${this.getSvgY(point.rawPrice)} `).join('');

    return (
      <path className="linechart-path" d={pathD} style={{ stroke: color }} />
    );
  }


  // build the axis
  makeAxis() {
    const { yLabelSize } = this.props;
    const x = this.getX();
    const y = this.getY();

    return (
        <g className="linechart-axis">
          <line
            x1={this.getSvgX(x.min) - yLabelSize} y1={this.getSvgY(y.min)}
            x2={this.getSvgX(x.max)} y2={this.getSvgY(y.min)}
            strokeDasharray="5" />
          <line
            x1={this.getSvgX(x.min) - yLabelSize} y1={this.getSvgY(y.max)}
            x2={this.getSvgX(x.max)} y2={this.getSvgY(y.max)}
            strokeDasharray="5" />
        </g>
    );
  }

  // make the labels
  makeLabels() {
    const {
      svgHeight, svgWidth, xLabelSize, yLabelSize,
    } = this.props;
    const padding = 5;
    return (
      <g className="linechart-label">
        {/* Y AXIS LABELS */}
        <text transform={`translate(${yLabelSize / 2}, 20)`} textAnchor="middle">
          {this.getY().max.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}
        </text>
        <text transform={`translate(${yLabelSize / 2}, ${svgHeight - xLabelSize - padding})`} textAnchor="middle">
          {this.getY().min.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}
        </text>
        {/* X AXIS LABELS */}
        <text transform={`translate(${yLabelSize}, ${svgHeight})`} textAnchor="start">
          { moment.utc(this.props.data[0].date, 'MMM-DD-YY hh:mm').format('MMM-DD-YY') }
        </text>
        <text transform={`translate(${svgWidth}, ${svgHeight})`} textAnchor="end">
          { moment.utc(this.props.data[this.props.data.length - 1].date, 'MMM-DD-YY hh:mm').format('MMM-DD-YY') }
        </text>
      </g>
    );
  }

  // find the closest point on the line to the mouse
  getCoords(e) {
    const { svgWidth, data, yLabelSize } = this.props;
    const svgLocation = document.getElementsByClassName('linechart')[0].getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2; // takes padding into consideration
    const relativeLoc = e.clientX - svgLocation.left - adjustment;

    const svgData = [];
    data.forEach((point) => {
      svgData.push({
        svgX: this.getSvgX(point.count),
        svgY: this.getSvgY(point.rawPrice),
        d: point.date,
        p: point.price,
      });
    });

    let closestPoint = {};
    for (let i = 0, c = 500; i < svgData.length; i++) {
      if (Math.abs(svgData[i].svgX - this.state.hoverLoc) <= c) {
        c = Math.abs(svgData[i].svgX - this.state.hoverLoc);
        closestPoint = svgData[i];
      }
    }
    if (relativeLoc - yLabelSize < 0) {
      this.stopHover();
    } else {
      this.setState({
        hoverLoc: relativeLoc,
        activePoint: closestPoint,
      });
      this.props.onChartHover(relativeLoc, closestPoint);
    }
  }

  // stop hover
  stopHover() {
    this.setState({ hoverLoc: null, activePoint: null });
    this.props.onChartHover(null, null);
  }

  // add circle to the active point
  makeActivePoint() {
    const { color, pointRadius } = this.props;
    return (
      <circle
        className='linechart_point'
        style={{ stroke: color }}
        r={pointRadius}
        cx={this.state.activePoint.svgX}
        cy={this.state.activePoint.svgY}
      />
    );
  }

  // draw the vertical hover line
  createLine() {
    const { svgHeight, xLabelSize } = this.props;
    return (
      <line className='hoverLine'
        x1={this.state.hoverLoc} y1={-8}
        x2={this.state.hoverLoc} y2={svgHeight - xLabelSize} />
    );
  }

  render() {
    const { svgHeight, svgWidth } = this.props;

    return (
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={'linechart'}
            onMouseLeave={ () => this.stopHover() }
            onMouseMove={ e => this.getCoords(e) } >
        <g>
          {this.makeAxis()}
          {this.makePath()}
          {this.makeArea()}
          {this.makeLabels()}
          {this.state.hoverLoc ? this.createLine() : null}
          {this.state.hoverLoc ? this.makeActivePoint() : null}
        </g>
      </svg>
    );
  }
}
// default props
LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  pointRadius: 5,
  svgHeight: 300,
  svgWidth: 900,
  xLabelSize: 20,
  yLabelSize: 80,
};

export default LineChart;
