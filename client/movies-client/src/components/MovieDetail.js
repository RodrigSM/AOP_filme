import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', text: '' });

  useEffect(() => {
    axios.get(`https://aop-filme.onrender.com/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));

    axios.get(`https://aop-filme.onrender.com/comments/${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.name || !newComment.email || !newComment.text) return;
    try {
      const response = await axios.post('https://aop-filme.onrender.com/comments', {
        ...newComment,
        movie_id: id
      });
      setComments([...comments, response.data]);
      setNewComment({ name: '', email: '', text: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`https://aop-filme.onrender.com/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!movie) return <p>Carregando...</p>;

  return (
    <div className="movie-detail-container">
      <h1>{movie.title}</h1>
      <img src={movie.poster} alt={movie.title} className="poster" />
      <p><strong>Plot:</strong> {movie.plot}</p>
      <p><strong>Full Plot:</strong> {movie.fullplot}</p>
      <p><strong>Genres:</strong> {movie.genres?.join(', ')}</p>
      <p><strong>Cast:</strong> {movie.cast?.join(', ')}</p>
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Runtime:</strong> {movie.runtime} mins</p>
      <p><strong>Directors:</strong> {movie.directors?.join(', ')}</p>
      <p><strong>Writers:</strong> {movie.writers?.join(', ')}</p>
      <p><strong>IMDb:</strong> {movie.imdb?.rating} ({movie.imdb?.votes} votos)</p>

      <hr />
      <h2>Comentários</h2>
      <ul className="comment-list">
        {comments.map(comment => (
          <li key={comment._id}>
            <strong>{comment.name}</strong> ({comment.email})<br />
            <em>{new Date(comment.date).toLocaleDateString()}</em><br />
            {comment.text}
            <button onClick={() => handleDeleteComment(comment._id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <div className="comment-form">
        <h3>Adicionar Comentário</h3>
        <input
          type="text"
          placeholder="Nome"
          value={newComment.name}
          onChange={e => setNewComment({ ...newComment, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newComment.email}
          onChange={e => setNewComment({ ...newComment, email: e.target.value })}
        />
        <textarea
          placeholder="Comentário"
          value={newComment.text}
          onChange={e => setNewComment({ ...newComment, text: e.target.value })}
        />
        <button onClick={handleAddComment}>Enviar</button>
      </div>
    </div>
  );
}

export default MovieDetail;
