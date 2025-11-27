
import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  margin: 20px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 10px;
  font-size: 16px;
`;

const SearchBar = () => {
  return (
    <SearchContainer>
      <Icon name="search" size={20} color="#888" />
      <SearchInput placeholder="Search" />
    </SearchContainer>
  );
};

export default SearchBar;
