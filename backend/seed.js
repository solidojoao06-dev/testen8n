const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tabacaria';

const productsToSeed = [
    {
        name: 'Tabaco Orgânico',
        description: 'Tabaco suave e orgânico, cultivado sem pesticidas.',
        price: 25.00,
        quantity: 100,
        image: 'images/tabaco-placeholder.png',
        sku: 'TO-001'
    },
    {
        name: 'Seda Clássica',
        description: 'Pacote com 50 folhas de seda de alta qualidade.',
        price: 5.00,
        quantity: 300,
        image: 'images/seda-placeholder.png',
        sku: 'SC-002'
    },
    {
        name: 'Isqueiro Maçarico',
        description: 'Isqueiro tipo maçarico, recarregável e com chama potente.',
        price: 35.00,
        quantity: 50,
        image: 'images/isqueiro-placeholder.png',
        sku: 'IM-003'
    },
    {
        name: 'Piteira de Vidro',
        description: 'Piteira de vidro reutilizável, fácil de limpar.',
        price: 15.00,
        quantity: 80,
        image: 'images/piteira-placeholder.png',
        sku: 'PV-004'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB conectado para seeding...');

        // Limpar dados antigos
        await Product.deleteMany({});
        console.log('Produtos antigos removidos.');

        // Inserir novos dados
        await Product.insertMany(productsToSeed);
        console.log('Novos produtos inseridos com sucesso!');

    } catch (err) {
        console.error('Erro durante o seeding do banco de dados:', err);
    } finally {
        // Fechar a conexão
        mongoose.connection.close();
        console.log('Conexão com o MongoDB fechada.');
    }
};

seedDB();
