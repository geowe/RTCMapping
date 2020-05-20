# RTCMapping
[Real-Time Collaborative Mapping](http://rtcm.geowe.org) se entiende como un sistema en el que se facilitará la edición (creación/modificación) de información espacial vectorial, fomentando la colaboración (por parte de un grupo de usuarios) en tiempo real, de manera que un usuario pueda ver lo que otros están editando en cada momento.

[Demo version](http://rtcm-app.geowe.org)

![Screenshot](https://github.com/geowe/RTCMapping/blob/master/rtcm-mapeo-colaborativo.gif)

## Objetivo
El objetivo principal es obtener un sistema en el que se refleje la funcionalidad base para poder realizar ediciones de información espacial, tanto en su componente espacial como alfanumérica, por varios usuarios en tiempo real, desde distintos dispositivos.

## Tecnología
- Nodejs
- Webpack
- OpenLayers v4.6.5
- W3.CSS
- socket.io

## Normas de contribución
**KISS**
- Código fuente: Se pueden enviar PR, que tras validarlas se incorporarán.
- Testing: me parecen fundamentales. Si quieres hacer pruebas de rendimiento, estabilidad, carga, etc. ¡Genial!
- Documentación y difusión.

## Estado del proyecto
Este proyecto se encuentra finalizado para la versión de demostración o prueba de concepto. El equipo de GeoWE está trabajando en los próximos avances del mapeo colaborativo en tiempo real.

## Configuración del proyecto

RTCMapping es una aplicación NodeJS (por lo que deberá tener instalado NodeJS en su máquina) y como tal, el procedimiento de instalación y configuración es el estándar para este tipo de proyectos. Los pasos para preparar la arquitectura son los siguientes:

1.- En el **lado cliente** deberá cambiar la dirección IP donde se conectará al servidor. Localice en el proyecto el fichero **RealTimeEngine** y en el método **connect** especifique la url de conexión.

2.- Para iniciar el proyecto cliente, deberá ejecutar (desde la consola) **npm install** y automáticamente se instalarán todas las dependencias especificadas en el fichero **package.json**, generando la carpeta **node_modules**. Una vez llegue aquí, podrá continuar la vía de desarrollo ejecutando **npm run start** y se levantará un servidor para entorno de desarrollo con la aplicación cliente en ejecución. Si desea generar el proyecto para despliegue ejecute **npm run build**.

3.- En el **lado servidor** deberá ejecutar el comando **node ./src/index.js** y se levantará el servidor a la escucha en el puerto especificado (por defecto es el puerto **3000**).
