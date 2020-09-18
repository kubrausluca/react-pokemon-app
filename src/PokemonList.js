import React from 'react'

export default function PokemonList({ pokemon }) {
    // {pokemon} = props.pokemon

    return (
        <div>
            {pokemon.map(p => (
                <div key={p}>{p}</div> 
            ))}
        </div>
    )
}
