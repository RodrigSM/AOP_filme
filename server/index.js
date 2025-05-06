const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./models/Movie'); // Este podes manter
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json()); // Para aceitar JSON no corpo das requisições

// Conexão MongoDB
const mongoURI = 'mongodb+srv://myusername:mypassword@cluster0.2ihtku4.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// ✅ Define o modelo de Comentário diretamente aqui
const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  movie_id: mongoose.Schema.Types.ObjectId,
  text: String,
  date: {
    type: Date,
    default: Date.now
  }
});
const Comment = mongoose.model('Comment', commentSchema);

// === Rotas de Filmes ===
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find().limit(50);
    res.json(movies);
  } catch (err) {
    res.status(500).send('Erro ao buscar filmes');
  }
});

app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Filme não encontrado');
    res.json(movie);
  } catch (err) {
    res.status(500).send('Erro ao buscar filme por ID');
  }
});

// === Rotas de Comentários ===

// Obter todos os comentários de um filme
app.get('/comments/:movieId', async (req, res) => {
  try {
    const comments = await Comment.find({ movie_id: req.params.movieId });
    res.json(comments);
  } catch (err) {
    res.status(500).send('Erro ao buscar comentários');
  }
});

// Criar um comentário
app.post('/comments', async (req, res) => {
  try {
    const comment = new Comment({ ...req.body, date: new Date() });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).send('Erro ao adicionar comentário');
  }
});

// Atualizar um comentário
app.put('/comments/:id', async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Erro ao atualizar comentário');
  }
});

// Deletar um comentário
app.delete('/comments/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send('Erro ao deletar comentário');
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
