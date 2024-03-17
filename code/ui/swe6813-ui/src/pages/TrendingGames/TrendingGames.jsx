import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header";
import styled from 'styled-components';
import Slider from 'react-slick'; // Import Slider component from the library

const Container = styled.div`
  padding: 20px;
`;

const GameCard = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const GameName = styled.div`
  color: #ffffff;
  background-color: #333333;
  padding: 8px;
  border-radius: 5px;
  margin-top: 10px;
`;

const GameListContainer = styled.div`
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #145C9E;
  color: #ffffff;
  padding: 12px;
`;

const TableRow = styled.tr`
  background-color: ${({ index }) => (index % 2 === 0 ? '#877666' : '#CBB9A8')};
`;

const TableCell = styled.td`
  padding: 12px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px; /* Adjust margin here */
`;

const SearchInput = styled.input`
  margin-left: auto;
  width: 300px;
  padding: 8px;
  border-radius: 20px;
`;

export default function TrendingGames() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGames, setFilteredGames] = useState([]);

    // Sample game data
    const games = useMemo(() => [
        { name: 'Game 1', followers: 100451, id: 1 },
        { name: 'Game 2', followers: 10000, id: 2 },
        { name: 'Game 3', followers: 95000, id: 3 },
        { name: 'Game 4', followers: 90000, id: 4 },
        { name: 'Game 5', followers: 81593, id: 5 }
    ], []);

    // Redirect to game details page
    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    // Filter games based on search term
    useEffect(() => {
        const filtered = games.filter(game =>
            game.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGames(filtered);
    }, [searchTerm, games]);

    // Settings for the carousel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1
    };

    return (
        <Container>
            <Header />
            <h1>Trending Games</h1>
            <Slider {...settings}>
                {games.map((game, index) => (
                    <GameCard key={game.id} onClick={() => handleGameClick(game.id)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>{game.followers}</div>
                            <div>follows</div>
                        </div>
                        <GameName>{game.name}</GameName>
                    </GameCard>
                ))}
            </Slider>
            <GameListContainer>
                <SearchContainer>
                    <h2>Game List</h2>
                    <SearchInput
                        type="text"
                        placeholder="Search For Game by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchContainer>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>Game Name</TableHeader>
                            <TableHeader>Number of Followers</TableHeader>
                            <TableHeader>Average Player Level</TableHeader>
                            <TableHeader>Average Player Attribute</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGames.map((game, index) => (
                            <TableRow key={game.id} index={index}>
                                <TableCell>{game.name}</TableCell>
                                <TableCell>{game.followers}</TableCell>
                                <TableCell>{/* Add average player level */}</TableCell>
                                <TableCell>{/* Add average player attribute */}</TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </GameListContainer>
        </Container>
    );
}