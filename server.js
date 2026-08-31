/**
 * ==========================================
 * E-Commerce API - User & Checkout Service
 * ==========================================
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simulación de base de datos en memoria
const users = [
    { 
        id: 1, 
        nombre: "Juan Pérez", 
        direccion: "Av. Los Olivos 123", 
        rol: "user" 
    },
    { 
        id: 2, 
        nombre: "Carlos Gómez", 
        direccion: "Calle Las Orquídeas 456", 
        rol: "user" 
    }
];

// Logger básico para auditoría
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

/**
 * Endpoint: Obtener perfil de usuario
 * Método: GET
 * Ruta: /api/users/:id
 */
app.get('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado en los registros." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

/**
 * Endpoint: Actualizar datos del perfil
 * Método: PUT
 * Ruta: /api/users/:id
 * Descripción: Recibe los datos del formulario frontend para actualizar el perfil.
 */
app.put('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado. No se puede realizar la actualización." });
        }

        // Actualizamos la entidad con los nuevos datos recibidos
        Object.assign(user, req.body);

        res.status(200).json({
            mensaje: "Perfil actualizado correctamente",
            data: user
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar la actualización." });
    }
});

/**
 * Endpoint: Procesar pago (Checkout)
 * Método: GET
 * Ruta: /api/checkout/:id
 */
app.get('/api/checkout/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado. Transacción abortada." });
        }

        // Validación de lógica de negocio basada en el nivel de acceso corporativo
        if (user.rol === "admin") {
            return res.status(200).json({ 
                mensaje: "Total a pagar: $0 (Descuento VIP Corporativo aplicado)" 
            });
        }

        res.status(200).json({ 
            mensaje: "Total a pagar: $150.00" 
        });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ error: "Error interno del servidor durante el checkout." });
    }
});

// Inicialización del servidor
app.listen(PORT, () => {
    console.log(`🚀 E-Commerce User Service corriendo en http://localhost:${PORT}`);
    console.log(`Endpoints disponibles:`);
    console.log(`- GET  /api/users/:id`);
    console.log(`- PUT  /api/users/:id`);
    console.log(`- GET  /api/checkout/:id`);
});