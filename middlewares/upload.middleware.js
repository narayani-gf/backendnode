const multer = require("multer");

// Filtro para recibir únicamente imágenes JPG
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/jpeg") && file.originalname.endsWith(".jpg")) {
        cb(null, true);
    } else {
        cb("Sólo se permiten imágenes con extensión JPG", false);
    }
};

// se configura el almacenamiento para los archivos subidos
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Se crea la instancia de multer
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;