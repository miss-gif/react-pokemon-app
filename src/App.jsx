import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
  const [pokemons, setPokemons] = useState([]);

  const url = "https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0";

  useEffect(() => {
    fetchPokeDate();
  }, []);

  const fetchPokeDate = async () => {
    try {
      const response = await axios.get(url);
      console.log(response.data.results);
      setPokemons(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return <div>App</div>;
};

export default App;
