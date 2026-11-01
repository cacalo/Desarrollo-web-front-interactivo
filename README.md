# Clases interactivas · Desarrollo Web (TUP)

Simuladores en HTML para explicar los conceptos de la materia de forma interactiva.
No usan frameworks ni build: cada página es HTML + CSS + JS plano, así que se pueden abrir con doble click o publicar tal cual en GitHub Pages.

## Estructura

```
index.html                      Portada, ordenada por temas
assets/css/base.css             Estilos compartidos (pensados para proyectar)
assets/css/kit.css              Piezas comunes de las experiencias de JS (quiz, código, consola)
assets/css/agenda.css           Maqueta de la Agenda (barra, menú, filas) y rayos X de componentes
assets/js/ui.js                 Utilidades compartidas: quiz, bloque de código, confeti
assets/js/videos.js             Videos de YouTube por tema: botón «🎬 Ver video» en la página y marca en la portada (la lista está adentro)
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
js-ts/interfaces.html           El molde (interface Contact) revisando un objeto, "¿Cuándo te enterás?" (JS vs TS) y "¿Compila?"
angular/componente.html         La Agenda en piezas (rayos X y árbol), un molde con muchas copias, estilos encapsulados
angular/inputs.html             Datos que bajan con input ([contact]="c") y avisos que suben con output
angular/senales.html            Red de señales del AuthService (signal, computed, effect) y memoria vs pantalla
angular/router.html             El Router compara la URL con app.routes.ts, :id, orden de rutas y routerLink
angular/jwt.html                Anatomía del token (leer sí, falsificar no) y el viaje del token hasta que vence
angular/guards.html             La escena animada de los guards, con modo predicción
angular/servicios.html          Un servicio compartido con inject vs copias con new, y "¿componente o servicio?"
angular/fetch.html              El viaje de un pedido con await: promesa pendiente/cumplida/rechazada, 401, sin conexión
angular/formularios.html        Formulario de login con signal forms: modelo, [formField], reglas y touched
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
