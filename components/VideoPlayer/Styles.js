import styled , {css} from 'styled-components/native';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const ContainerMain = styled.SafeAreaView`
  background-color: #000;
  ${props =>
        props.fullscreen &&
        css`
      width: ${parseInt(props.viewportWidth)}px;
      height: ${parseInt(props.viewportHeight)}px;
    `}
`;

export const Container = styled.View`
  background-color: #28a745;
  padding: 10px;
  height: 50
  flex-direction: row;
  align-items: center;
`;

export const LeftBlock = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TopBlock = styled.View`
  flex-direction: row;
  align-items: flex-start;
  paddingRight: 15px;
  left: 10px;
  
`;

export const MiddleBlock = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const RightBlock = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Button = styled.TouchableOpacity`
bottom: 5;
`;


export const SelectorContainer = styled.View`
  position: absolute;
  background: #28a745;
  width: 100px;
  padding: 5px;
  z-index: 1;
  bottom: 42px;
  padding: 0;
`;

export const SelectorButton = styled(TouchableOpacity)`
  padding: 10px 5px;
  z-index: 2;
  border-bottom-color: #fff;
  border-bottom-width: 1px;
`;
