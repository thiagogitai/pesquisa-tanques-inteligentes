const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, '../../public/uploads');

// Garantir que o diretório de uploads existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

exports.uploadFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhuma foto foi enviada' });
    }

    const filename = `${uuidv4()}.jpg`;
    const filepath = path.join(uploadsDir, filename);

    // Otimizar imagem com sharp
    await sharp(req.file.buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(filepath);

    const fotoUrl = `/uploads/${filename}`;

    res.status(201).json({
      mensagem: 'Foto enviada com sucesso',
      fotoUrl: fotoUrl,
      filename: filename
    });
  } catch (err) {
    console.error('Erro ao fazer upload:', err);
    res.status(500).json({ 
      erro: 'Erro ao fazer upload da foto', 
      detalhes: err.message 
    });
  }
};

exports.deleteFoto = (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(uploadsDir, filename);

    // Validar que o arquivo está no diretório de uploads
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(400).json({ erro: 'Caminho inválido' });
    }

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ mensagem: 'Foto deletada com sucesso' });
    } else {
      res.status(404).json({ erro: 'Foto não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ 
      erro: 'Erro ao deletar foto', 
      detalhes: err.message 
    });
  }
};
