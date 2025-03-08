// Using Node.js `require()`
const mongoose = require('mongoose');


//definimos el esquema del documento
const cocheSchema = new mongoose.Schema({
    marca: String,
    color: String,
    potencia: Number,
    precio: Number
});
//creamos el modelo

const Coche = mongoose.model('Coche', cocheSchema, 'coches');
const buscaPrimero = () => {
    //buscamos el primer registro
    return Coche.findOne()
        .then(coche => {
            if (coche) {
                console.log('Primer coche encontrado', coche);
            } else {
                console.log('No se encontró ningún registro')
            }
        })
        .catch(err => console.error('Error al obtener el coche', err));
}

const buscaTodos = () => {
    //buscamos todos los registros
    return Coche.find()
        .then(coches => {
            if (coches.length > 0) {
                /*console.log('coches encontrados',coches);*/
                return coches;
            } else {
                console.log('No se encontró ningún registro');
                return null;
            }
        })
        .catch(err => {
            console.error('Error al obtener los coches', err);
            throw err;
        });
}

const buscaPorId = (id) => {
    //buscamos el primer registro
    return Coche.findById(id)
        .then(coche => {
            if (coche) {
                //console.log('Primer coche encontrado',coche);
                return coche;
            } else {
                console.log('No se encontró ningún registro con el id' + id);
                return null;
            }
        })
        .catch(err => {
            console.error('Error al obtener el coche' + id, err);
            throw err;
        });
}

/***************************** */
// busca por precio mayor a 3000
/****************************** */
const buscaPrecioMayor = (precioMinimo) => {
    //buscamos todos los registros
    Coche.find({ precio: { $gt: precioMinimo } })
        .then(coches => {
            if (coches.length > 0) {
                console.log('coches encontrados con precio mayor a ' + precioMinimo, coches)
            } else {
                console.log('No se encontró ningún registro')
            }
        })
        .catch(err => console.error('Error al obtener los coches', err));
}

const creaNuevoCoche = (m, c, p, pr) => {
    const nuevoCoche = new Coche({
        marca: m,
        color: c,
        potencia: p,
        precio: pr
    });

    // Guardar el coche en la base de datos
    return nuevoCoche.save()
        .then(coche => {
            console.log('Coche guardado:', coche);
            return coche;
        })
        .catch(err => {
            console.error('Error al guardar el coche:', err);
            throw err;
        });

}
const creaNuevoCocheGeneral = (coche) => {
    const nuevoCoche = new Coche({
        marca: m,
        precio: p
    });

    // Guardar el coche en la base de datos
    return nuevoCoche.save()
        .then(coche => {
            console.log('Coche guardado:', coche);
            return coche;
        })
        .catch(err => {
            console.error('Error al guardar el coche:', err);
            throw err;
        });

}

const actualizaPrecio = (idCoche, nuevoPrecio) => {
    Coche.findByIdAndUpdate(idCoche, { precio: nuevoPrecio }, { new: true })
        .then(cocheActualizado => {
            if (cocheActualizado) {
                console.log('coche actualizado:', cocheActualizado);
            } else {
                console.log('No se encontró ningún coche con ese ID.');
            }
        })
        .catch(err => console.error('Error al actualizar el coche:', err));
}

const actualizaCoche = (idCoche, cocheActualizar) => {
    return Coche.findByIdAndUpdate(idCoche, cocheActualizar, { new: true })
        .then(cocheActualizado => {
            if (cocheActualizado) {
                console.log('Coche actualizado:', cocheActualizado);
                return cocheActualizado;
            } else {
                console.log('No se encontró ningún coche con ese ID.');
                return null;
            }
        })
        .catch(err => console.error('Error al actualizar el coche:', err));
}

const borraCoche = (idCocheParaBorrar) => {
    return Coche.findByIdAndDelete(idCocheParaBorrar)
        .then(cocheEliminado => {
            if (cocheEliminado) {
                console.log('Coche eliminado:', cocheEliminado);
                return cocheEliminado;
            } else {
                console.log('No se encontró ningún coche con ese ID.');
                return null;
            }
        })
        .catch(err => {
            console.error('Error al eliminar el coche:', err);
            throw err;
        });

}
module.exports = {
    actualizaCoche, buscaPrimero, buscaTodos, buscaPorId,
    buscaPrecioMayor, actualizaPrecio, borraCoche, creaNuevoCoche, Coche
}
