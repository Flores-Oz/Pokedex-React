import { useState, useEffect } from "react"
import { useForm } from "../hook/useform"
import { PokemonContext } from "./PokemonContext"

export const PokemonProvider = ({children}) => {

  const [allPokemons, setallPokemons] = useState([]);
  const [GlobalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setOffset] = useState(0);

  ///customshook
  const {valueSearch, onInputChange, onResetForm} = useForm({
    valueSearch: '',
  })

  ///simple state
  const [loading, setloading] = useState(true)
  const [active, setactive] = useState(false)

const getAllPokemons = async(limit = 50) =>{
    const baseURL = 'https://pokeapi.co/api/v2/'
    
    const res = await fetch(`${baseURL}pokemon?limit=${limit}&offset=${offset}`)
    const data = await res.json();
    
    const promises = data.results.map(async(pokemon) =>{
      const res = await fetch(pokemon.url)
      const data = await res.json();
      return data
    })
    const results = await Promise.all(promises)

		setallPokemons([...allPokemons, ...results]);
    setloading(false)
  }

  /// All Pokemons
  const getGlobalPokemons = async() => {
    const baseURL = 'https://pokeapi.co/api/v2/';

		const res = await fetch(
			`${baseURL}pokemon?limit=100000&offset=0`
		);
		const data = await res.json();

		const promises = data.results.map(async pokemon => {
			const res = await fetch(pokemon.url);
			const data = await res.json();
			return data;
		});
		const results = await Promise.all(promises);

		setGlobalPokemons(results);
    setloading(false)
  }

  ///Select Pokemon for id
  const getPokemonByID = async(id) => {
    const baseURL = 'https://pokeapi.co/api/v2/';

		const res = await fetch(
			`${baseURL}pokemon/${id}`)
    const data = await res.json();
    return data
  }

useEffect(() => {
  getAllPokemons()
}, [offset])

useEffect(() => {
  getGlobalPokemons();
}, []);

//btn cargar mas
const onClickLoadMore = () => {
  setOffset(offset + 50);
};

// Filter Function + State
const [typeSelected, setTypeSelected] = useState({
  grass: false,
  normal: false,
  fighting: false,
  flying: false,
  poison: false,
  ground: false,
  rock: false,
  bug: false,
  ghost: false,
  steel: false,
  fire: false,
  water: false,
  electric: false,
  psychic: false,
  ice: false,
  dragon: false,
  dark: false,
  fairy: false,
  unknow: false,
  shadow: false,
});

const [filteredPokemons, setfilteredPokemons] = useState([]);

const handleCheckbox = e => {
  setTypeSelected({
    ...typeSelected,
    [e.target.name]: e.target.checked,
  });

  if (e.target.checked) {
    const filteredResults = GlobalPokemons.filter(pokemon =>
      pokemon.types
        .map(type => type.type.name)
        .includes(e.target.name)
    );
    setfilteredPokemons([...filteredPokemons, ...filteredResults]);
  } else {
    const filteredResults = filteredPokemons.filter(
      pokemon =>
        !pokemon.types
          .map(type => type.type.name)
          .includes(e.target.name)
    );
    setfilteredPokemons([...filteredResults]);
  }
};



  return (
    <PokemonContext.Provider value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        GlobalPokemons,
        getPokemonByID,
        onClickLoadMore,
        // Loader
				loading,
				setloading,
				// Btn Filter
				active,
				setactive,
				// Filter Container Checkbox
				handleCheckbox,
				filteredPokemons,
    }}>
        {children}
    </PokemonContext.Provider>
  )
}
