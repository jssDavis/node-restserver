const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//1.--- Crear Schema con la instancia de monsoose
let Schema = mongoose.Schema;

//2.----Crear Schema
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción de la categoria es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'UsuarioModel'
    },
    estado: {
        type: Boolean,
        default: true
    }
});



// let categoriaSchema = new Schema({
//     descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
//     usuario: { type: Schema.Types.ObjectId, ref: 'UsuarioModel' },
//     estado: {
//         type: Boolean,
//         default: true
//     }
// });


categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único ' })

module.exports = mongoose.model('CategoriaModel', categoriaSchema);