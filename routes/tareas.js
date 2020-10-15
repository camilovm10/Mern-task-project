const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const { route } = require('./proyectos');

// Crear una tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'The name is required').not().isEmpty(),
        check('proyecto', 'The project is required').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener tareas por proyecto

router.get('/',
    auth,
    tareaController.obtenerTareas
)

// Actualizar tarea

router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

// elimiar tarea

router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;