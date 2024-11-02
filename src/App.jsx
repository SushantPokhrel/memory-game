import React, { useEffect, useState } from "react";
import "./App.css";

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]); // Store Pokémon data
  const [displayedPokemon, setDisplayedPokemon] = useState([]); // Shuffled Pokémon data
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedIds, setClickedIds] = useState([]);

  useEffect(() => {
    const getRandomPokemonId = () => Math.floor(Math.random() * 898) + 1; // There are 898 Pokémon in the Pokédex

    const fetchPokemonData = async () => {
      try {
        //makes an array of len 10
        const promises = Array.from({ length: 12 }, () =>
          fetch(
            `https://pokeapi.co/api/v2/pokemon/${getRandomPokemonId()}/`
          ).then((response) => {
            if (!response.ok) {
              throw new Error("Pokémon not found");
            }
            return response.json();
          })
        );
        console.log(promises);
        const results = await Promise.all(promises);
        setPokemonData(results); // Store the fetched Pokémon data
        shufflePokemonData(results); // Shuffle the Pokémon data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPokemonData();
  }, []);

  const shufflePokemonData = (data) => {
    const shuffled = data.sort(() => 0.5 - Math.random());
    setDisplayedPokemon(shuffled);
  };

  function handleScore(current_id) {
    if (clickedIds.includes(current_id)) {
      // ID has been clicked before, game over
      setBestScore((prev) => Math.max(prev, score));
      setScore(0);
      setClickedIds([]); // Reset clicked IDs
      shufflePokemonData(pokemonData); // Shuffle the Pokémon data for the next round
    } else {
      // ID has not been clicked before, increase score
      setScore((prev) => prev + 1);
      setClickedIds((prev) => [...prev, current_id]);
      shufflePokemonData(pokemonData); // Shuffle the Pokémon data for the next round
    }
  }

  return (
    <>
      <div className="info-div">
        <h1>Memory Game</h1>
        <p>Try not to click a Pokémon more than once</p>
        <div>
          <span>Current Score: {score}</span>
          <span>Best Score: {bestScore}</span>
        </div>
      </div>
      <div
        onClick={() => setCount((prev) => prev + 1)}
        className="flex-pokemon"
      >
        {displayedPokemon.map((item, index) => (
          <div
            key={index}
            className="card"
            onClick={() => handleScore(item.id)}
          >
            <img
              src={item.sprites.back_default}
              alt="image unavailable"
              className="image"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default PokemonList;
