/* Simulador del Router de Angular + guards de la Agenda.
   Es el "motor" compartido por las 3 versiones del demo: cada versión sólo cambia la forma de mostrarlo.

   Modela app.routes.ts del proyecto Agenda:
     /login, /register   -> onlyGuestGuard
     ""  (redirectTo login)
     ""  LoggedComponent -> onlyUserGuard, con hijos /contacts, /contacts/:id y /admin (ejemplo extra con adminGuard)
*/
(function () {

  // ------------------------------------------------------------------ código fuente que se muestra
  const FILES = {
    "app.routes.ts":
`export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.component"),
    canActivate: [onlyGuestGuard],
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register/register.component"),
    canActivate: [onlyGuestGuard],
  },
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "",
    loadComponent: () => import("./layouts/logged/logged.component"),
    canActivate: [onlyUserGuard],
    children: [
      { path: "contacts", loadComponent: () => import("./pages/contacts/contacts.component") },
      { path: "contacts/:id", loadComponent: () => import("./pages/contact-info/contact-info.component") },
      { path: "admin", loadComponent: () => import("./pages/admin/admin.component"), canActivate: [adminGuard] }, // ejemplo extra
    ]
  },
];`,

    "only-user.guard.ts":
`import { CanActivateFn, RedirectCommand, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/** Guard que verifica que un usuario se encuentre logueado */
export const onlyUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  if (authService.token() !== null) return true;
  const router = inject(Router)
  const urlTree: UrlTree = router.parseUrl('/login');
  return new RedirectCommand(urlTree, { skipLocationChange: true });
};`,

    "only-guest.guard.ts":
`import { CanActivateFn, RedirectCommand, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/** Guard que verifica que un usuario se encuentre deslogueado */
export const onlyGuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  if (!authService.token()) return true;
  const router = inject(Router)
  const urlTree: UrlTree = router.parseUrl('/contacts');
  return new RedirectCommand(urlTree);
};`,

    "admin.guard.ts":
`import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/** EJEMPLO EXTRA: sólo deja pasar si el token trae el claim role = "admin" */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  if (authService.user()?.role === 'admin') return true;
  const router = inject(Router)
  return new RedirectCommand(router.parseUrl('/contacts'));
};`,

    "auth.service.ts":
`/** El token guardado en memoria de la aplicación */
token = signal<string | null>(localStorage.getItem("token"));

/** Desconecto al usuario si se venció su sesión */
readonly vencimientoToken = effect(() => {
  if (!this.token()) return this.logout();
  const tokenDecodificado = decodeToken(this.token()!);
  if (new Date(tokenDecodificado.exp * 1000) < new Date()) {
    this.logout();
  }
});

/** Desloguea a un usuario */
logout() {
  this.token.set(null);
  this.router.navigate(["/"]);
}`,
  };

  // líneas importantes de cada archivo (1-based)
  const LINES = {
    routes: { login: [3, 4, 5], loginGuard: [5], register: [8, 9, 10], registerGuard: [10], redirect: [12], logged: [14, 15, 16], loggedGuard: [16], contacts: [18], contactId: [19], admin: [20], all: [1] },
    guard: { fn: [6], inject: [7], check: [8], redirect: [9, 10, 11], redirectReturn: [11] },
    auth: { effect: [5], check: [8, 9], logout: [14, 15, 16] },
  };

  // ------------------------------------------------------------------ rutas
  const ROUTES = {
    "/login":        { component: "LoginComponent",       label: "Login",        guards: ["onlyGuestGuard"], lines: LINES.routes.login },
    "/register":     { component: "RegisterComponent",    label: "Registro",     guards: ["onlyGuestGuard"], lines: LINES.routes.register },
    "/contacts":     { component: "ContactsComponent",    label: "Contactos",    guards: ["onlyUserGuard"], parent: "LoggedComponent", lines: LINES.routes.contacts },
    "/contacts/:id": { component: "ContactInfoComponent", label: "Detalle de contacto", guards: ["onlyUserGuard"], parent: "LoggedComponent", lines: LINES.routes.contactId },
    "/admin":        { component: "AdminComponent",       label: "Admin",        guards: ["onlyUserGuard", "adminGuard"], parent: "LoggedComponent", lines: LINES.routes.admin },
  };

  function matchRoute(url) {
    const clean = ("/" + url.replace(/^\/+/, "").replace(/\/+$/, "")).toLowerCase();
    if (clean === "/") return { redirectTo: "/login" };
    if (ROUTES[clean]) return { key: clean, params: {} };
    const m = clean.match(/^\/contacts\/([^/]+)$/);
    if (m) return { key: "/contacts/:id", params: { id: m[1] } };
    return null;
  }

  // ------------------------------------------------------------------ guards
  const GUARDS = {
    onlyUserGuard: {
      file: "only-user.guard.ts",
      question: "¿token() !== null?",
      run: (s) => s.token
        ? { ok: true, why: "Hay un token guardado, así que el usuario está logueado." }
        : { ok: false, redirect: "/login", skipLocationChange: true, why: "No hay token: no está logueado. Lo mandamos a /login (sin cambiar la URL de la barra)." },
    },
    onlyGuestGuard: {
      file: "only-guest.guard.ts",
      question: "¿!token()?",
      run: (s) => !s.token
        ? { ok: true, why: "No hay token: es un invitado, puede ver esta página." }
        : { ok: false, redirect: "/contacts", why: "Ya tiene sesión iniciada: no tiene sentido mostrarle el login. Lo mandamos a /contacts." },
    },
    adminGuard: {
      file: "admin.guard.ts",
      question: "¿user()?.role === 'admin'?",
      run: (s) => s.admin
        ? { ok: true, why: "El token trae role = \"admin\"." }
        : { ok: false, redirect: "/contacts", why: "El token no trae role = \"admin\". Lo mandamos a /contacts." },
    },
  };

  /**
   * Simula una navegación.
   * @param {string} url  URL que el usuario escribe
   * @param {{token: "none"|"valid"|"expired", admin: boolean}} input
   * @returns {{events: object[], final: object}}
   */
  function simulate(url, input) {
    const s = { token: input.token === "valid" || input.token === "expired" ? input.token : null, admin: !!input.admin };
    const events = [];
    let addressBar = url;
    let current = url;

    if (s.token === "expired") {
      events.push({ kind: "expired", text: "El AuthService revisa la fecha de vencimiento del token: ya venció. Llama a logout() y el token pasa a null." });
      s.token = null;
      s.admin = false;
    }

    for (let hop = 0; hop < 6; hop++) {
      events.push({ kind: "navStart", url: current, hop, text: hop === 0 ? `El usuario quiere ir a ${current}` : `Nueva navegación a ${current}` });
      const match = matchRoute(current);

      if (!match) {
        events.push({ kind: "notFound", url: current, text: `Ninguna ruta de app.routes.ts coincide con "${current}". El Router tira NavigationError y la pantalla no cambia.` });
        return { events, final: { kind: "error", url: current, addressBar, state: s } };
      }

      if (match.redirectTo) {
        events.push({ kind: "configRedirect", from: current, to: match.redirectTo, lines: LINES.routes.redirect, text: `La ruta "" tiene redirectTo: "login". El Router cambia ${current} por ${match.redirectTo} antes de revisar guards.` });
        current = match.redirectTo;
        addressBar = current;
        events.push({ kind: "navStart", url: current, hop, text: `Ahora busca ${current}`, continued: true });
      }

      const key = matchRoute(current).key;
      const route = ROUTES[key];
      events.push({ kind: "match", url: current, key, route, lines: route.lines, text: route.parent
        ? `Coincide con "${key.slice(1)}", que es hija de la ruta con ${route.parent}. Primero se revisan los guards del padre y después los del hijo.`
        : `Coincide con la ruta "${key.slice(1)}".` });

      let redirected = null;
      for (const gName of route.guards) {
        const g = GUARDS[gName];
        const r = g.run(s);
        const ownerLines = gName === "onlyUserGuard" ? LINES.routes.loggedGuard
          : gName === "adminGuard" ? LINES.routes.admin
          : key === "/register" ? LINES.routes.registerGuard : LINES.routes.loginGuard;
        events.push({ kind: "guard", guard: gName, file: g.file, question: g.question, ok: r.ok, redirect: r.redirect, skipLocationChange: !!r.skipLocationChange, text: r.why, routeLines: ownerLines, state: { token: s.token, admin: s.admin } });
        if (!r.ok) { redirected = r; break; }
      }

      if (redirected) {
        events.push({ kind: "redirect", from: current, to: redirected.redirect, skipLocationChange: redirected.skipLocationChange,
          text: redirected.skipLocationChange
            ? `RedirectCommand cancela esta navegación y arranca una nueva hacia ${redirected.redirect}. Como usa skipLocationChange, la barra de direcciones sigue mostrando ${addressBar}.`
            : `RedirectCommand cancela esta navegación y arranca una nueva hacia ${redirected.redirect}.` });
        if (!redirected.skipLocationChange) addressBar = redirected.redirect;
        current = redirected.redirect;
        continue;
      }

      events.push({ kind: "render", url: current, key, route, params: match.params || {}, addressBar,
        text: route.parent ? `Todos los guards devolvieron true: se muestra ${route.parent} y adentro ${route.component}.` : `Todos los guards devolvieron true: se muestra ${route.component}.` });
      return { events, final: { kind: "render", url: current, key, route, addressBar, state: s } };
    }
    events.push({ kind: "loop", text: "Demasiadas redirecciones: hay un loop entre guards." });
    return { events, final: { kind: "error", url: current, addressBar, state: s } };
  }

  window.GuardSim = { FILES, LINES, ROUTES, GUARDS, simulate, matchRoute };
})();
