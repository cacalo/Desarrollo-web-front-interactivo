# Clases interactivas · Desarrollo Web (TUP)

Simuladores en HTML para explicar los conceptos de la materia de forma interactiva.
No usan frameworks ni build: cada página es HTML + CSS + JS plano, así que se pueden abrir con doble click o publicar tal cual en GitHub Pages.

## Estructura

```
index.html                      Portada, ordenada por temas
assets/css/base.css             Estilos compartidos (pensados para proyectar)
assets/css/kit.css              Piezas comunes de las experiencias de JS (quiz, código, consola)
assets/js/ui.js                 Utilidades compartidas: quiz, bloque de código, confeti
assets/js/guard-sim.js          Motor que simula el Router + guards de la Agenda
html-css/etiquetas-basicas.html Construir con piezas, desafíos y juego "¿Qué etiqueta es?"
html-css/etiquetas-no-semanticas.html Agrupar con div, div vs span y juego "¿div, span o semántica?"
html-css/etiquetas-semanticas.html Armar la página por zonas, "¿Quién lee tu página?" y juego "¿Qué zona es?"
html-css/selectores.html         Apuntar con selectores, "¿Qué se pinta?" y desafíos de escribir el selector
html-css/propiedades.html       Perillas de propiedades (con herencia), "Igualá el diseño" y "¿Qué propiedad cambió?"
html-css/modelo-caja.html       Capas de la caja, "El misterio del ancho" (box-sizing) y "¿Qué espacio es?"
js-ts/dom.html                  Buscar en el árbol del DOM, buscar y cambiar, y juego "¿Qué devuelve?"
js-ts/eventos.html              Listeners y radar de eventos, input vs change vs keydown, "¿Qué evento uso?"
js-ts/condicionales.html        Cascada de if/else if/switch (con break olvidado), ¿verdadero o falso?, "¿Qué se muestra?"
js-ts/bucles.html               for clásico, for…of y forEach (array, array de objetos, objeto, texto) vuelta por vuelta, recorrer la página, "¿Qué recibe?"
js-ts/funciones.html            De nominal a flecha paso a paso, diferencias (hoisting, return, this), "¿Son equivalentes?"
js-ts/laboratorio.html          20 retos de JavaScript con editor, vista en vivo, pruebas y progreso guardado (ex practica-js-basica)
angular/guards.html             La escena animada de los guards, con modo predicción
```

Cada experiencia busca explicar el concepto con animación e interacción, sin mostrar código de Angular (eso se ve en el repo real del proyecto).

## Publicar en GitHub Pages

1. Crear un repo nuevo en GitHub (por ejemplo `clases-desarrollo-web`) y subir esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Clases interactivas: guards"
   git branch -M main
   git remote add origin https://github.com/<usuario>/clases-desarrollo-web.git
   git push -u origin main
   ```
2. En el repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. En un minuto queda en `https://<usuario>.github.io/clases-desarrollo-web/`.

## Probar en local

Alcanza con abrir `index.html` en el navegador. No se usan módulos ES ni `fetch`, así que funciona también desde `file://`.
