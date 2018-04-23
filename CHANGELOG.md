# Change Log
Todos los cambios notables de este proyecto quedarán reflejados en este fichero.
Sistema de versionado adherido a [Semantic Versioning](http://semver.org/).

## [Unreleased]
En desarrollo

### Añadido
- Edición alfanumérica


## [0.0.9]pre-alpha - 2018-04-23
Versión de prueba disponible [rtcm-app.geowe.org](http://rtcm-app.geowe.org).

### Añadido
- Implementación multisala. Los colaboradores se conectan a salas independientes para editar
- Se genera y muestra la url a compartir (al pulsar en compartir). También puede verse desde el sidebar (al pulsar en conectado).
- El usuario se reconecta usando el mismo nick que tenía. Cuando pulsa en Desconectar-Reconectar.
- Reconexión automática con el mismo nick cuando se desconecta por algún error en la red y se ha desconectado del socket.
- Herramienta de información alfanumérica.

### Correcciones
- issues: #7, #27, #28, #29, #30



## [0.0.6]pre-alpha - 2018-04-12

### Correcciones
- Geolocalización usando OSM Nominatim. Cambio de posición de la búsqueda y correcciones
- Aplicar buffer #25

## [0.0.5]pre-alpha - 2018-04-11

### Añadido
- Eliminar elementos #17
- Aplicar buffer #25
- Búsquedas de localizaciones en el mapa por nombre #24

## [0.0.3] Previsto
### Añadido
- Sidebar: iconos, enlace a ayuda, estado, nº de colaboradores conectados

## [0.0.2]pre-alpha - 2018-03-28

### Añadido
- Guardar capa a GeoJson #11
- Modificar título del mapa #8
- Sidebar: Contacto, condiciones de uso, visibilidad de las capas #5, #6, #10
- Herramienta zoom to extent: zoom a la extensin del mapa de edición #4
- Herramientas de medida: longitud y área #1

