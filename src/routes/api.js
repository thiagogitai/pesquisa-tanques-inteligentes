const express = require('express');
const multer = require('multer');
const clientesController = require('../controllers/clientesController');
const tanquesController = require('../controllers/tanquesController');
const itensController = require('../controllers/itensController');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// Configurar multer para upload de fotos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

// Rotas de Clientes
router.get('/clientes', clientesController.getAllClientes);
router.get('/clientes/:id', clientesController.getClienteById);
router.post('/clientes', clientesController.createCliente);
router.put('/clientes/:id', clientesController.updateCliente);
router.delete('/clientes/:id', clientesController.deleteCliente);

// Rotas de Tanques
router.get('/clientes/:cliente_id/tanques', tanquesController.getTanquesByCliente);
router.post('/tanques', tanquesController.createTanque);
router.put('/tanques/:id', tanquesController.updateTanque);
router.delete('/tanques/:id', tanquesController.deleteTanque);

// Rotas de Itens de Tanque
router.get('/tanques/:tanque_id/itens', itensController.getItensByTanque);
router.post('/itens', itensController.createItem);
router.put('/itens/:id', itensController.updateItem);
router.delete('/itens/:id', itensController.deleteItem);

// Rotas de Upload
router.post('/upload', upload.single('foto'), uploadController.uploadFoto);
router.delete('/uploads/:filename', uploadController.deleteFoto);

module.exports = router;
