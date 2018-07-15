import React from 'react';
import '../styles/main.css';

class Box extends React.Component {
  render() {
    const { hoverLoc, activePoint } = this.props;
    const svgLocation = document.getElementsByClassName('linechart')[0].getBoundingClientRect();

    const placementStyles = {};
    const width = 150;
    placementStyles.width = `${width}px`;
    placementStyles.left = hoverLoc + svgLocation.left - (width / 2);

    return (
      <div className='hover' style={ placementStyles }>
        <div className='date'>{ activePoint.d }</div>
        <div className='price'>{ activePoint.p }</div>
      </div>
    );
  }
}

export default Box;
