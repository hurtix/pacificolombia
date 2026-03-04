# Destino Pacífico

Un sitio web moderno construido con Astro y Tailwind CSS para promover el turismo en el Pacífico colombiano. El sitio consume contenido dinámico de una instalación local de WordPress con campos personalizados ACF (Advanced Custom Fields).

## Características

- ⚡ **Astro** - Framework web ultrarrápido para sitios estáticos
- 🎨 **Tailwind CSS** - Framework CSS utilitario altamente personalizable  
- 🔗 **Integración WordPress** - Consume datos de WordPress REST API
- 📱 **Responsive Design** - Diseño adaptativo para todos los dispositivos
- 🖼️ **ACF Support** - Soporte completo para campos personalizados de Advanced Custom Fields

## Requisitos Previos

- Node.js 18+ 
- WordPress local corriendo en Local by Flywheel
- Plugin Advanced Custom Fields (ACF) instalado y configurado en WordPress

## Configuración de WordPress

1. Asegúrate de que tu instalación local de WordPress esté corriendo
2. Instala y activa el plugin Advanced Custom Fields
3. Configura los campos ACF necesarios para el contenido
4. Verifica que la REST API esté habilitada (por defecto en WordPress)

### Campos ACF Sugeridos

Para páginas (especialmente homepage):
- `hero_title` - Título principal del hero
- `hero_subtitle` - Subtítulo del hero  
- `hero_image` - Imagen de fondo del hero
- `cta_text` - Texto del botón de llamada a la acción
- `cta_url` - URL del botón de llamada a la acción

Para posts/destinos:
- `featured_image` - Imagen destacada
- `ubicacion` - Ubicación del destino
- `descripcion_corta` - Descripción breve
- `galeria` - Galería de imágenes

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar URL de WordPress
# Edita src/lib/wordpress.ts y actualiza WORDPRESS_URL con tu URL local
```

## Configuración

1. Abre `src/lib/wordpress.ts`
2. Actualiza la variable `WORDPRESS_URL` con la URL de tu instalación local:
   ```typescript
   const WORDPRESS_URL = 'http://localhost:10004'; // Tu URL local
   ```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El sitio estará disponible en http://localhost:4321
```

## Producción

```bash
# Construir para producción
npm run build

# Vista previa de la construcción
npm run preview
```

## Estructura del Proyecto

```
/
├── public/          # Archivos estáticos
├── src/
│   ├── components/  # Componentes reutilizables
│   │   ├── Hero.astro
│   │   └── PostCard.astro
│   ├── layouts/     # Layouts de página
│   │   └── Layout.astro
│   ├── lib/         # Utilidades y APIs
│   │   └── wordpress.ts
│   ├── pages/       # Páginas del sitio (rutas)
│   │   └── index.astro
│   └── styles/      # Estilos globales
│       └── global.css
└── README.md
```

## API de WordPress

El sitio consume datos de WordPress a través de la REST API. Las principales funciones disponibles:

- `getPosts(limit)` - Obtener posts recientes
- `getPost(id)` - Obtener un post específico
- `getPages()` - Obtener todas las páginas
- `getPage(id)` - Obtener una página específica
- `getCustomPosts(type, limit)` - Obtener custom post types

## Personalización

### Añadir Nuevos Campos ACF

1. Crea los campos en WordPress Admin
2. Actualiza las interfaces TypeScript en `src/lib/wordpress.ts`
3. Usa los campos en tus componentes Astro

### Crear Nuevas Páginas

1. Crea un archivo `.astro` en `src/pages/`
2. Importa el layout: `import Layout from '../layouts/Layout.astro'`
3. Usa los datos de WordPress según sea necesario

## Comandos Disponibles

| Comando                   | Acción                                      |
| :------------------------ | :------------------------------------------ |
| `npm install`             | Instalar dependencias                       |
| `npm run dev`             | Iniciar servidor local en `localhost:4321` |
| `npm run build`           | Construir sitio para producción            |
| `npm run preview`         | Vista previa local de construcción         |
| `npm run astro ...`       | Ejecutar comandos CLI de Astro            |

## Tecnologías

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Advanced Custom Fields](https://www.advancedcustomfields.com/)

## Soporte

Si encuentras algún problema o tienes preguntas, por favor crea un issue en el repositorio del proyecto.
