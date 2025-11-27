
import React from 'react';
import styled from 'styled-components/native';
import { ImageSourcePropType } from 'react-native';

const CardContainer = styled.View`
  width: 150px;
  height: 200px;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const CardImage = styled.ImageBackground`
  flex: 1;
  justify-content: flex-end;
`;

const CardTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin: 10px;
`;

interface DestinationCardProps {
  image: ImageSourcePropType;
  title: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ image, title }) => {
  return (
    <CardContainer>
      <CardImage source={image}>
        <CardTitle>{title}</CardTitle>
      </CardImage>
    </CardContainer>
  );
};

export default DestinationCard;
