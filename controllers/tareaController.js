const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea una nueva tarea
exports.crearTarea = async (req, resp) => {

    // Revisar si hay errores

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        return resp.status(400).json({ errors: errors.array() })
    }

    

    try {

        // extraer el proyecto y comporbar si existe

        const { proyecto } = req.body;
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return resp.status(404).json({ msg: "The project was not found" })
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado

        if ( existeProyecto.creador.toString() !== req.usuario.id ) {
            return resp.status(401).json({ msg: 'Not Authorized' });
        }

        // Creamos la tarea

        const tarea = new Tarea(req.body);
        await tarea.save();
        resp.json({ tarea });

    } catch (error) {
        console.log(error);
        resp.status(500).send('An error was ocurred')
    }

}

// Obtiene las tareas por proyecto

exports.obtenerTareas = async (req, resp) => {

    try {
        
        // extraer el proyecto y comporbar si existe

        const { proyecto } = req.query;

        
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return resp.status(404).json({ msg: "The project was not found" })
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado

        if ( existeProyecto.creador.toString() !== req.usuario.id ) {
            return resp.status(401).json({ msg: 'Not Authorized' });
        }

        // Obtener las tareas por proyecto

        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        resp.json({ tareas });

    } catch (error) {
        console.log(error);
        resp.status(500).send('An error was ocurred')
    }

}

// Actualizar tarea

exports.actualizarTarea = async (req, resp) => {

    try {
        
        // extraer el proyecto y comporbar si existe

        const { proyecto, nombre, estado } = req.body;

        // Revisar si la tarea existe

        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return resp.status(404).json({ msg: 'That task does not exist' })
        }

        // Extraer proyecto
        
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado

        if ( existeProyecto.creador.toString() !== req.usuario.id ) {
            return resp.status(401).json({ msg: 'Not Authorized' });
        }


        // crear un objeto con la informacion editada

        const nuevaTarea = {};

            nuevaTarea.nombre = nombre
            nuevaTarea.estado = estado
        
        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id : req.params.id }, nuevaTarea, { new : true });

        resp.json({ tarea });

    } catch (error) {
        console.log(error);
        resp.status(500).send('An error was ocurred')
    }

}

exports.eliminarTarea = async (req, resp) => {

    try {
        
        // extraer el proyecto y comporbar si existe

        const { proyecto } = req.query;

        // Revisar si la tarea existe

        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return resp.status(404).json({ msg: 'That task does not exist' })
        }

        // Extraer proyecto
        
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado

        if ( existeProyecto.creador.toString() !== req.usuario.id ) {
            return resp.status(401).json({ msg: 'Not Authorized' });
        }


        // Eliminar tarea

        await Tarea.findOneAndRemove({ _id: req.params.id });
        resp.json({ msg: 'Task deleted' })


    } catch (error) {
        console.log(error);
        resp.status(500).send('An error was ocurred')
    }

}