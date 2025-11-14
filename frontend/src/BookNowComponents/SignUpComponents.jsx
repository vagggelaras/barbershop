import styled from "styled-components";
// const show = keyframes`
//   0%, 49.99% {
// 		opacity: 0;
// 		z-index: 1;
// 	}

// 	50%, 100% {
// 		opacity: 1;
// 		z-index: 5;
// 	}
// `;

// const hide = keyframes`
//   0%, 49.99% {
//     opacity: 1;
//     z-index: 5;
//   }

//   50%, 100% {
//     opacity: 0;
//     z-index: 1;
//   }
// `

export const Container = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4);
  position: absolute;
  overflow: hidden;
  width: 60%;
  left: 20%;
  min-height: 60vh;

  /* Tablet */
  @media (max-width: 1024px) {
    width: 80%;
    left: 10%;
  }

  /* Mobile */
  @media (max-width: 768px) {
    width: 95%;
    left: 2.5%;
    min-height: 70vh;
    border-radius: 10px;
  }
`;

export const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  ${props =>
        props.signingIn !== true
            ? `
  transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	`
            : null}
`;

export const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  ${props => (props.signingIn !== true ? `transform: translateX(100%);` : null)}
`;

export const Form = styled.form`
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 0 35px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  color: #D3DAD9;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 1.8rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  color: #D3DAD9;
  font-size: 14px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #D3DAD9;
  }

  &:focus {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 14px 15px;
    font-size: 16px; /* Prevents zoom on iOS */
    margin: 6px 0;
  }
`;

export const Button = styled.button`
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  color: #D3DAD9;
  font-size: 14px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
    border: 2px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: none;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 12px 35px;
    font-size: 13px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 14px 30px;
    font-size: 13px;
    letter-spacing: 1.5px;
    width: 100%;
  }
`;

export const GhostButton = styled(Button)`
  background: transparent;
  border: 2px solid #EFECE3;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid white;
  }

  /* Mobile */
  @media (max-width: 768px) {
    width: auto;
    padding: 12px 25px;
  }
`;

export const Anchor = styled.a`
  color: #D3DAD9;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  transition: color 0.3s ease;

  &:hover {
    color: #D3DAD9;
  }
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${props =>
        props.signingIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
  background: linear-gradient(135deg, #44444E 0%, #715A5A 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #EFECE3;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.2);
  ${props => (props.signingIn !== true ? `transform: translateX(50%);` : null)}
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 0 25px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${props => (props.signingIn !== true ? `transform: translateX(0);` : null)}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${props => (props.signingIn !== true ? `transform: translateX(20%);` : null)}
`;
export const Paragraph = styled.p`
  font-size: 15px;
  font-weight: 300;
  line-height: 24px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  color: #D3DAD9;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 22px;
    margin: 15px 0 25px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 20px;
    margin: 12px 0 20px;
  }
`;
