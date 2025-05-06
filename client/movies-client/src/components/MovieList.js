import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Lista de Filmes</h1>
      <div className="movie-grid">
      {movies
        .filter(movie => movie.poster && movie.poster !== 'N/A' && movie.poster.startsWith('http'))
        .map(movie => (
          <div key={movie._id} className="movie-card">
            <Link to={`/movies/${movie._id}`}>
            <img
              src={movie.poster}
              alt={movie.title}
              className="poster"
              onError={(e) => {
                e.currentTarget.closest('.movie-card').style.display = 'none';
              }}
            />
              <h2>{movie.title}</h2>
            </Link>
            <p><strong>Ano:</strong> {movie.year}</p>
            <p><strong>Géneros:</strong> {movie.genres?.join(', ')}</p>
            <p><strong>Duração:</strong> {movie.runtime} min</p>
          </div>
      ))}
      </div>
    </div>
  );
}

export default MovieList;
