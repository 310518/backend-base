
const { response } = require("express");
const { Producto } = require("../models");
 

// obtenerProductos - paginado - total - populate

const obtenerProductos = async(req, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    });
}

// obtenerProducto - populate , {regresar el objeto de la categoria}
 
const obtenerProducto = async (req, res = response) => {
    
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    

    res.json(producto);
}

// Crear Producto

const crearProducto = async (req, res = response) => {
    
    const { estado, usuario, ...body } = req.body;
    
    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });
    
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // generar la data a Guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
        
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);

}

// actualizarProducto {debe de dejarnos cambar el nombre y validar q el nomre no exista}

const actualizarProducto = async (req, res = response) => {


    const { id } = req.params;
    let { estado, usuario, ...data} = req.body;
    
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;
   
    const producto = await Producto.findByIdAndUpdate(id,data,{new: true});

    res.json(producto);
    
}
 
// borrarProducto - cambiar a estado:false

const borrarProducto = async (req, res = response) => {

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false },{new: true});

    res.json(productoBorrado);
}




module.exports = {
    obtenerProductos,
    obtenerProducto, 
    crearProducto,
    actualizarProducto,
    borrarProducto,
}
