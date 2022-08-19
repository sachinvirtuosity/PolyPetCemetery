import React from 'react';
import styled from 'styled-components';

const Tab = styled.button`
  font-size: 20px;
  padding: 10px 60px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 0;
  outline: 0;
  ${({ active }) =>
        active &&
        `
    border-bottom: 2px solid black;
    opacity: 1;
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const TabComponent = ({ types, active, tabSelected }) => {
    return (
        <ButtonGroup>
            {types.map(type => (
                <Tab
                    key={type.param}
                    active={active === type}
                    onClick={() => tabSelected(type)}
                >
                    {type.type}
                </Tab>
            ))}
        </ButtonGroup>
    );
}

export default TabComponent;