// NPM
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// COMPONENTS

// ACTIONS/CONFIG

// STYLES
const Person = styled.div`
  position: absolute;
  right: 35px;
  bottom: 35px;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  margin-right: 15px;
  color: white;
  text-align: right;

  span {
    display: block;

    &:last-child {
      margin-top: 6px;
      font-size: 13px;
    }
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  overflow: hidden;
  border: 2px solid white;
  border-radius: 30px;
  background: #1e1013;
`;

// MODULE
export default function SliderPerson({ name, location, avatar }) {
  return (
    <Person>
      <Content>
        <span>{name}</span>
        <span>{location}</span>
      </Content>
      <Avatar>
        <img src={avatar} />
      </Avatar>
    </Person>
  );
}

// Props Validation
SliderPerson.propTypes = {};