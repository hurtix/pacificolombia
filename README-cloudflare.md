# Destino Pacífico

Un sitio web promocional para el turismo en el Pacífico colombiano, construido con Astro y Tailwind CSS.

## 🚀 Tecnologías

- **Astro** - Framework de sitios estáticos ultra-rápido
- **Tailwind CSS** - Framework CSS utility-first
- **WordPress Integration** - API REST para contenido dinámico 
- **TypeScript** - Tipado estático
- **GSAP** - Animaciones avanzadas

## 📁 Estructura del Proyecto

```
/
├── public/
│   └── images/           # Imágenes del sitio
├── src/
│   ├── components/       # Componentes Astro reutilizables
│   ├── content/         # Contenido markdown (narrativas)
│   ├── layouts/         # Layouts de página
│   ├── lib/            # Utilidades y funciones
│   ├── pages/          # Páginas del sitio
│   └── styles/         # Estilos CSS globales
├── astro.config.mjs    # Configuración de Astro
└── package.json
```

## 🛠️ Instalación

```bash
npm install
```

## 💻 Desarrollo

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

## 📦 Build y Despliegue

### Para desarrollo con WordPress local:
```bash
npm run build
```

### Para producción estática (Cloudflare Pages):
```bash
npm run build:cloudflare
```

## 🌐 Despliegue en Cloudflare Pages

### Configuración automática:

1. **Conecta tu repositorio** a Cloudflare Pages
2. **Configuración de build**:
   - Build command: `npm run build:cloudflare`
   - Build output directory: `dist`
   - Node.js version: `18`

### Variables de entorno en Cloudflare:

```env
PUBLIC_STATIC_MODE=true
NODE_VERSION=18
```

### Para usar WordPress en producción:
```env
WORDPRESS_URL=https://tu-sitio-wordpress.com
PUBLIC_STATIC_MODE=false
```

## 🔧 Configuración

### Modo de operación:

- **Desarrollo**: Usa WordPress local para contenido dinámico
- **Producción estática**: Usa datos de fallback de las narrativas
- **Producción con WordPress**: Conecta a WordPress en vivo

### Variables de entorno:

- `WORDPRESS_URL`: URL del sitio WordPress
- `PUBLIC_STATIC_MODE`: Activa el modo estático (true/false)

## 📝 Contenido

### Narrativas:
- Las narrativas se almacenan en `src/content/`
- Utilizan formato markdown con metadata
- Soporte para español e inglés

### WordPress Integration:
- Custom post type: `experiencia`
- ACF campos personalizados
- Taxonomías: municipio, departamento, tipología

## 🎨 Características

- ✅ Diseño responsive
- ✅ Slider interactivo con GSAP
- ✅ Navegación flotante
- ✅ Integración WordPress con fallbacks
- ✅ Generación estática
- ✅ SEO optimizado
- ✅ Imágenes optimizadas

## 🚀 Despliegue rápido

Para desplegar inmediatamente en Cloudflare Pages sin WordPress:

1. Hacer push del código a tu repositorio
2. Conectar el repositorio a Cloudflare Pages  
3. Usar la configuración automática
4. Las experiencias se mostrarán usando datos de fallback

¡Tu sitio estará funcionando con datos predefinidos de las 20 experiencias!

## 📞 Soporte

Para problemas o preguntas sobre la configuración, revisa los logs de build en Cloudflare Pages o consulta la documentación de Astro.