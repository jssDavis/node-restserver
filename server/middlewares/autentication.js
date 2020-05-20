// =================Importaciones==============
const jwt = require('jsonwebtoken');

// ======================
// Verifica Token
// ======================

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //Es el nombre que mandamos en los headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


};


// ======================
// Verifica ADMIN_ROLE
// ======================
let verificaAdminRole = (req, res, next) => {

    let usuarioRole = req.usuario.role;

    if (usuarioRole != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tienes permisos para realizar esta operación'
            }
        });
    } else {

        next();
    }



}



module.exports = {
    verificaToken,
    verificaAdminRole
}