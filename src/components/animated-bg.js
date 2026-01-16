import styled, { keyframes } from 'styled-components';

const movePattern = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 500px 500px; }
`;

const AnimatedBg = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;
  background-image: url(${process.env.PUBLIC_URL + '/assets/images/bg.jpg'});
  background-repeat: repeat;
  opacity: 0.1;
  background-size: auto; // <-- Cambia el tamaño aquí
  animation: ${movePattern} 120s linear infinite;
`;


export default AnimatedBg;