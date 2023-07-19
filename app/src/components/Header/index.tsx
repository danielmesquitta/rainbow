import { NavLink } from 'react-router-dom';
import { HeaderContainer, HeaderWrapper } from './styles';

export const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <NavLink to="/">
          <img src="/vite.svg" />
          <span>Rainbow Form</span>
        </NavLink>
      </HeaderContainer>
    </HeaderWrapper>
  );
};
