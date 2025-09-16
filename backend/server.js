const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB (será configurada no próximo passo)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tabacaria';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado com sucesso.'))
.catch(err => console.error('Erro ao conectar com o MongoDB:', err));


// Rota de Teste
app.get('/', (req, res) => {
    res.send('<h1>API da Tabacaria Online</h1><p>O servidor está funcionando.</p>');
});

// Rotas da API
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
