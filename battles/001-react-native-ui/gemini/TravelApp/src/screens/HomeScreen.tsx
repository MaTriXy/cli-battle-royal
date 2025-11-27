
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styled from 'styled-components/native';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const HeaderText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-left: 20px;
  margin-top: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-left: 20px;
  margin-top: 20px;
`;

const destinations = [
  { id: '1', title: 'Japan', image: require('../assets/images/japan.jpg') },
  { id: '2', title: 'Bali', image: require('../assets/images/bali.jpg') },
  { id: '3', title: 'Paris', image: require('../assets/images/paris.jpg') },
  { id: '4', title: 'Japan', image: require('../assets/images/japan.jpg') },
  { id: '5', title: 'Bali', image: require('../assets/images/bali.jpg') },
  { id: '6', title: 'Paris', image: require('../assets/images/paris.jpg') },
];

const HomeScreen = () => {
  return (
    <Container>
      <HeaderText>Let's go travel</HeaderText>
      <SearchBar />
      <SectionTitle>Top Destinations</SectionTitle>
      <FlatList
        data={destinations}
        renderItem={({ item }) => <DestinationCard title={item.title} image={item.image} />}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ alignItems: 'center' }}
      />
    </Container>
  );
};

export default HomeScreen;
