import { vi, describe, test, expect, beforeEach, SpyInstance } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import PokeCard from '../components/PokeCard/PokeCard';
import stubPokemon from './data/pokemon.json';
import renderApp, { mockPokeAPI } from './renderApp';
import * as API from '../API';

const pokemonData = {
  name: stubPokemon.name,
  imageUrl: stubPokemon.sprites.front_default,
  imageAlt: stubPokemon.name,
  types: stubPokemon.types.map(({ type: { name } }) => name),
} as const;

describe('Tests for the Card component', () => {
  const renderPokeCard = (pokemon = pokemonData) =>
    render(
      <MemoryRouter>
        <PokeCard key={pokemon.name} {...pokemonData} />
      </MemoryRouter>
    );

  let fetchPokemonByName: SpyInstance;
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    mockPokeAPI();
    fetchPokemonByName = vi.spyOn(API, 'fetchPokemonByName');
  });

  test('Ensure that the card component renders the relevant card data', async () => {
    renderPokeCard();
    const { name, imageUrl, types } = pokemonData;
    const Name = await screen.findByText(name);
    const Image = await screen.findByAltText(name);
    const Types = await screen.findByText(`Types: ${types.join(', ')}`);
    expect(Name).toBeInTheDocument();
    expect(Image).toHaveAttribute('src', imageUrl);
    expect(Types).toBeInTheDocument();
  });

  test('Validate that clicking on a card opens a detailed card component', async () => {
    renderApp();
    const Cards = await screen.findAllByTestId('pokemon-card-link');
    await user.click(Cards[0]);
    const Aside = await screen.findByTestId('aside');
    expect(Aside).toBeInTheDocument();
  });

  test('Check that clicking triggers an additional API call to fetch detailed information', async () => {
    renderApp();
    const Cards = await screen.findAllByTestId('pokemon-card-link');
    await user.click(Cards[1]);
    expect(fetchPokemonByName).toBeCalled();
    await screen.findByTestId('pokemon-details-description');
  });
});
