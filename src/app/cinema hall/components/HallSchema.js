import React, { Component } from 'react';
import { Badge, UncontrolledTooltip, Container } from 'reactstrap';

export default class HallSchema extends Component {
  render() {
    const { schema, hallTitle, seatTypes } = this.props;
    return <Seats schema={schema} hallTitle={hallTitle} seatTypes={seatTypes} />;
  }
}

const Seats = props => {
  const { schema, hallTitle, seatTypes } = props;

  const seats = schema.map((row, rowIndex) => {
    const rowSeats = new Array(Number(row.numberOfSeats)).fill().map((seat, seatIndex) => (
      <>
        <Badge color="primary" id={`hallTitle-${hallTitle}_row${rowIndex + 1}seat${seatIndex + 1}`}>
          {+seatTypes.find(seatType => seatType.id === +row.seatsType).numberOfPeople === 1 ? (
            seatIndex + 1
          ) : (
            <Container>{` ${seatIndex + 1}`}</Container>
          )}
        </Badge>{' '}
        <UncontrolledTooltip
          placement="right"
          target={`hallTitle-${hallTitle}_row${rowIndex + 1}seat${seatIndex + 1}`}
        >
          <p>{`row: ${rowIndex + 1}`}</p>
          <p>{`seat: ${seatIndex + 1}`}</p>
          <p>{`type: ${seatTypes.find(seatType => seatType.id === +row.seatsType).title}`}</p>
        </UncontrolledTooltip>
      </>
    ));

    const newRow = (
      <h6 className="text-center">
        {`${rowIndex + 1} `}
        {rowSeats}
        {`${rowIndex + 1} `}
      </h6>
    );

    return newRow;
  });

  return <>{seats}</>;
};
