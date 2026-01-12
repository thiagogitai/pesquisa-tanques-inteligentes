const express = require('express');
const multer = require('multer');
const authController = require('../controllers/authController');
const clientesController = require('../controllers/clientesController');
const tanquesController = require('../controllers/tanquesController');
const itensController = require('../controllers/itensController');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// Rotas de Autenticação
router.post('/auth/login', authController.login);
router.get('/auth/me', authController.verificarToken);
router.post('/auth/logout', authController.logout);

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

// Rotas de Clientes (com autenticação)
router.get('/clientes', authController.autenticar, clientesController.getAllClientes);
router.get('/clientes/:id', authController.autenticar, clientesController.getClienteById);
router.post('/clientes', authController.autenticar, clientesController.createCliente);
router.put('/clientes/:id', authController.autenticar, authController.verificarAdmin, clientesController.updateCliente);
router.delete('/clientes/:id', authController.autenticar, authController.verificarAdmin, clientesController.deleteCliente);

// Rotas de Tanques
router.get('/clientes/:cliente_id/tanques', tanquesController.getTanquesByCliente);
router.post('/tanques', tanquesController.createTanque);
router.put('/tanques/:id', authController.autenticar, authController.verificarAdmin, tanquesController.updateTanque);
router.delete('/tanques/:id', authController.autenticar, authController.verificarAdmin, tanquesController.deleteTanque);

// Rotas de Itens de Tanque
router.get('/tanques/:tanque_id/itens', itensController.getItensByTanque);
router.post('/itens', itensController.createItem);
router.put('/itens/:id', authController.autenticar, authController.verificarAdmin, itensController.updateItem);
router.delete('/itens/:id', authController.autenticar, authController.verificarAdmin, itensController.deleteItem);

// Rotas de Upload
router.post('/upload', upload.single('foto'), uploadController.uploadFoto);
router.delete('/uploads/:filename', authController.autenticar, authController.verificarAdmin, uploadController.deleteFoto);

// Rotas de Relatórios (apenas admin)
const relatoriosController = require('../controllers/relatoriosController');
router.get('/relatorios/clientes-detalhes', authController.autenticar, authController.verificarAdmin, relatoriosController.getAllClientesComDetalhes);
router.get('/relatorios/mapa', authController.autenticar, authController.verificarAdmin, relatoriosController.getClientesParaMapa);
router.get('/relatorios/estatisticas', authController.autenticar, authController.verificarAdmin, relatoriosController.getEstatisticas);
router.get('/relatorios/por-vendedor', authController.autenticar, authController.verificarAdmin, relatoriosController.getDadosPorVendedor);
router.get('/relatorios/cliente/:id', authController.autenticar, authController.verificarAdmin, relatoriosController.getClienteDetalhado);

module.exports = router;
