const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// Carregar dados
function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {
    return { usuarios: [] };
  }
}

// Salvar dados
function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Rota POST /usuarios
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ mensagem: 'Senha mínima de 6 caracteres' });
    }

    // Carregar usuários
    const db = loadDB();
    const usuarios = db.usuarios || [];

    // Verificar email duplicado
    const usuarioExistente = usuarios.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );

    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 12);

    // Criar usuário
    const novoUsuario = {
      id: Date.now(),
      nome,
      email: email.toLowerCase(),
      senha: senhaHash,
      criadoEm: new Date().toISOString()
    };

    // Salvar
    usuarios.push(novoUsuario);
    db.usuarios = usuarios;
    saveDB(db);

    console.log('✅ Novo usuário:', novoUsuario.email);

    res.json({ mensagem: 'Conta criada com sucesso!' });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
});

// Rota GET para ver usuários (opcional)
app.get('/usuarios', (req, res) => {
  const db = loadDB();
  res.json(db.usuarios || []);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Backend JSON rodando em http://localhost:${PORT}`);
  console.log(`📁 Dados salvos em db.json`);
});