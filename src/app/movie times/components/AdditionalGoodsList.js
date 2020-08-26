import React from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardFooter,
  Button,
  Row,
  Col,
  Container,
} from 'reactstrap';

const GoodsCard = props => {
  const { image, title, description, price, id } = props.goods;
  const { number } = props;
  return (
    <Card>
      <CardImg
        src={
          image || 'https://i.pinimg.com/originals/8a/eb/d8/8aebd875fbddd22bf3971c3a7159bdc7.png'
        }
      />
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardText>
          <p>{description}</p>
          <p>{`price: ${price}$`}</p>
        </CardText>
      </CardBody>
      <CardFooter>
        <Row>
          <Col>
            <Button color="primary" onClick={props.handleAddAdditionalGoodsToTicket(id)}>
              <h5>+</h5>
            </Button>
          </Col>
          <Col>
            <Container>{number}</Container>
          </Col>
          <Col>
            <Button color="warning" onClick={props.handleRemoveAdditionalGoodsFromTicket(id)}>
              <h5>-</h5>
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};

export const AdditionalGoodsList = props => {
  const { additionalGoods, selectedAdditionalGoods } = props;

  return (
    <Row lg="5" sm="3" xs="1">
      {additionalGoods.map(goods => (
        <GoodsCard
          number={
            selectedAdditionalGoods.find(selectedGoods => selectedGoods.id === goods.id)
              ? selectedAdditionalGoods.find(selectedGoods => selectedGoods.id === goods.id).number
              : 0
          }
          goods={goods}
          handleAddAdditionalGoodsToTicket={props.handleAddAdditionalGoodsToTicket}
          handleRemoveAdditionalGoodsFromTicket={props.handleRemoveAdditionalGoodsFromTicket}
        />
      ))}
    </Row>
  );
};
