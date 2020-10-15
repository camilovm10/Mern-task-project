const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, resp) => {

    // Revisar si hay errores

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        return resp.status(400).json({ errors: errors.array() })
    }


    try {
        // crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);


        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // Guardamos el proeycto
        proyecto.save();
        resp.json(proyecto);
        
    } catch (error) {
        console.log(error)
        resp.status(500).send('An error was ocurred')
    }   


}

// Obtiene todos los proyectos del usuario actual

exports.obtenerProyectos = async (req, resp) => {

    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        resp.json({ proyectos });
    } catch (error) {
        console.log(error);
        resp.status(500).send('An error was ocurred');
    }

}

//Actualiza un proyecto

exports.actualizarProyecto = async (req, resp) => {

    // Revisar si hay errores

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        return resp.status(400).json({ errors: errors.array() })
    }

    // Extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {

        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);


        // SI el proyecto existe o no
        if (!proyecto) {
            return resp.status(404).json({ msg: 'Project not found' })
        }


        // Revisar que el creador del proyecto sea quien accede

        if ( proyecto.creador.toString() !== req.usuario.id ) {
            return resp.status(401).json({ msg: 'Not Authorized' });
        }


        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });

        resp.json({ proyecto });
        
    } catch (error) {
        console.log(error);
        resp.status(500).send("Error in the server");
    }

}


// Eliminar un proyecto por su id

exports.eliminarProyecto = async (req, resp) => {


    try {

        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);


        // SI el proyecto existe o no
        if (!proyecto) {
            return resp.status(404).json({ msg: 'Project not found' })
        }


        // Revisar que el creador del proyecto sea quien accede

        if ( proyecto.creador.toString() !== req.usuario.id ) {
            return resp.status(401).json({ msg: 'Not Authorized' });
        }

        // ELiminar proyecto

        await Proyecto.findOneAndRemove({ _id : req.params.id });
        resp.json({ msg: 'Project Deleted' })

    } catch (error) {
        console.log(error);
        resp.status(500).send('Server Error')
    }

}