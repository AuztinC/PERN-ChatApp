import styled from "styled-components";

const DefaultButton = styled.button `
    background-color: purple;
    color: ${({red}) => (red && 'red') || '#645cfc'};
    `

export default DefaultButton


