import React, { Component } from 'react';
import { Badge, UncontrolledTooltip, Container, Button } from 'reactstrap';

export default class HallSchema extends Component {
  render() {
    const {
      schema,
      hallTitle,
      seatTypes,
      bookedSeats,
      selectedSeats,
      seatsBookedByUser,
    } = this.props;
    return (
      <>
        <h4>Hall "{hallTitle}"</h4>
        <Seats
          schema={schema}
          hallTitle={hallTitle}
          seatTypes={seatTypes}
          bookedSeats={bookedSeats}
          selectedSeats={selectedSeats}
          handleSelectSeat={this.props.handleSelectSeat}
          seatsBookedByUser={seatsBookedByUser}
        />
      </>
    );
  }
}

const Seats = props => {
  const { schema, hallTitle, seatTypes, bookedSeats, selectedSeats, seatsBookedByUser } = props;

  const seats = schema.map((row, rowIndex) => {
    const rowSeats = new Array(Number(row.numberOfSeats)).fill().map((seat, seatIndex) => {
      return (
        <>
          <Button
            onClick={props.handleSelectSeat(rowIndex, seatIndex, +row.seatsType)}
            color={
              selectedSeats.some(
                selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
              )
                ? 'warning'
                : seatsBookedByUser.length &&
                  seatsBookedByUser.some(
                    selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
                  )
                ? 'success'
                : 'primary'
            }
            id={`hallTitle-${hallTitle}_row${rowIndex + 1}seat${seatIndex + 1}`}
            disabled={bookedSeats.some(
              bookedSeat => bookedSeat.row === rowIndex && bookedSeat.seat === seatIndex
            )}
          >
            <Badge
              color={
                selectedSeats.some(
                  selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
                )
                  ? 'warning'
                  : seatsBookedByUser.length &&
                    seatsBookedByUser.some(
                      selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
                    )
                  ? 'success'
                  : 'primary'
              }
            >
              {+seatTypes.find(seatType => seatType.id === +row.seatsType).numberOfPeople === 1 ? (
                seatIndex + 1
              ) : (
                <Container>{`${seatIndex + 1}`}</Container>
              )}
            </Badge>
          </Button>{' '}
          <UncontrolledTooltip
            placement="right"
            target={`hallTitle-${hallTitle}_row${rowIndex + 1}seat${seatIndex + 1}`}
          >
            <p>{`row: ${rowIndex + 1}`}</p>
            <p>{`seat: ${seatIndex + 1}`}</p>
            <p>{`type: ${seatTypes.find(seatType => seatType.id === +row.seatsType).title}`}</p>
          </UncontrolledTooltip>
        </>
      );
    });

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
