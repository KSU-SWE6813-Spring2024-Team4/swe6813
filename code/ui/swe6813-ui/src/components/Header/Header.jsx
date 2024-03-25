import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Styled components
const HeaderContainer = styled.div`
  background-color: #145c9e;
  color: white;
  padding: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DropdownContainer = styled.div`
  position: relative;
  margin-right: 20px;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  position: absolute;
  background-color: #f4eded;
  z-index: 1;
  top: calc(100% + 5px); /* Position dropdown below Explore link */
  left: 0; /* Align dropdown with the start of the Explore link */
  width: ${(props) =>
    props.width}px; /* Set width dynamically based on link width */
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 10px;
`;

const StyledLinkTitle = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 12px;
  margin-right: 3px;
  position: relative;
`;

const StyledLink = styled(Link)`
  color: black;
  padding: 5px 1px;
  display: block;
  text-decoration: none;
  &:hover {
    background-color: #145c9e;
    color: white;
  }
`;
const ExploreContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
const UserContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const UserLink = styled(StyledLinkTitle)`
  margin-right: 50px;
`;

const UserPhoto = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const DropdownArrow = styled.div`
  position: absolute;
  top: -10px;
  left: calc(20% - 5px); /* Position arrow at the center */
  border: solid transparent;
  content: " ";
  height: 0px;
  width: 0px;
  border-color: rgba(0, 0, 0, 0);
  border-width: 6px;
  border-bottom-color: #f4eded;
`;

function Header() {
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [exploreLinkWidth, setExploreLinkWidth] = useState(0);

  const toggleExploreDropdown = () => {
    setExploreDropdownOpen(!exploreDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Callback to set width of Explore link
  const handleExploreLinkWidth = () => {
    const width = document.getElementById("explore-link").offsetWidth;
    setExploreLinkWidth(width);
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <img
          src="placeholder_image.jpg"
          alt="Logo"
          style={{ marginRight: "10px" }}
        />
        <StyledLinkTitle
          id="explore-link"
          to="#"
          onMouseEnter={() => {
            toggleExploreDropdown();
            handleExploreLinkWidth();
          }}
          onMouseLeave={toggleExploreDropdown}
        >
          Explore
        </StyledLinkTitle>
        <DropdownContainer>
          <ExploreContainer>
            <DropdownContent
              open={exploreDropdownOpen}
              width={exploreLinkWidth}
              onMouseEnter={toggleExploreDropdown}
              onMouseLeave={toggleExploreDropdown}
            >
              <DropdownArrow />
              <StyledLink to="/games">Games</StyledLink>
              <StyledLink to="/players">Players</StyledLink>
            </DropdownContent>
          </ExploreContainer>
        </DropdownContainer>
      </LogoContainer>
      <DropdownContainer>
        <UserContainer>
          <UserPhoto src="https://via.placeholder.com/150" alt="User" />
          <UserLink
            to="#"
            onMouseEnter={toggleUserDropdown}
            onMouseLeave={toggleUserDropdown}
          >
            User
          </UserLink>
          <DropdownContent
            open={userDropdownOpen}
            onMouseEnter={toggleUserDropdown}
            onMouseLeave={toggleUserDropdown}
          >
            <DropdownArrow />
            <StyledLink to="/account-settings">Account Settings</StyledLink>
            <StyledLink to="/sign-out">Sign Out</StyledLink>
          </DropdownContent>
        </UserContainer>
      </DropdownContainer>
    </HeaderContainer>
  );
}

export default Header;