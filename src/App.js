import React, { useState, useEffect } from 'react';
import { getAllPokemon, getPokemon } from './services/pokemon';
import PokemonList from "./components/pokemonCard/PokemonList";
import Navbar from "./components/navbar";
import Pagination from './components/Pagination'
import axios from 'axios';
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon")
  const [nextPageUrl, setNextPageUrl] = useState()
  const [prevPageUrl, setPrevPageUrl] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      let res = await getAllPokemon(currentPageUrl);
      setNextPageUrl(res.next);
      setPrevPageUrl(res.previous);
      let pokemon = await loadingPokemon(res.results);
      setLoading(false);
    }
    fetchData();
  }, [])

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextPageUrl)
    await loadingPokemon(data.results)
    setNextPageUrl(data.next);
    setPrevPageUrl(data.previous)
    setLoading(false);
  }

  const prev = async () => {
    if (!prevPageUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevPageUrl)
    await loadingPokemon(data.results)
    setPrevPageUrl(data.previous)
    setNextPageUrl(data.next);
    setLoading(false);
  }

  // useEffect(() => {
  //   setLoading(true)
  //   let cancel
  //   axios.get(currentPageUrl, {
  //     cancelToken: new axios.CancelToken(c => cancel = c)
  //   }).then(res => {
  //     setLoading(false)
  //     setNextPageUrl(res.data.next)
  //     setPrevPageUrl(res.data.previous)
  //     // setPokemon(res.data.results.map(p => p.name))
  //     setPokemon(res.data.results)

  //   })

  //   return () => cancel()

  // }, [currentPageUrl])

  const loadingPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon.url);
      return pokemonRecord
    }))

    setPokemon(_pokemonData)
  }

  console.log(pokemon);

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl)
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl)
  }

  // if (loading) return "Loading..."

  return (
    <div>
      { loading ? <h1>Loading...</h1> : (
        <>
          <Navbar />

          <div className="btn">
            <button onClick={prev}>Prev</button>
            <button onClick={next}>Next</button>
          </div>

          <div className="grid-container">
            {pokemon.map((pokemon, i) => {
              return <PokemonList key={i} pokemon={pokemon} />
            })}
          </div>
        </>
      )}
    </div>
    // <>
    //   <PokemonList pokemon={pokemon} />
    //   <Pagination
    //     gotoNextPage={nextPageUrl ? gotoNextPage : null}
    //     gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
    //   />
    // </>
  );
}

export default App;
