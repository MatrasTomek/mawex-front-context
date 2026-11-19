# Panel `/mawexadmin` — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Panel admina bloga pod `https://mawex-biuro.pl/mawexadmin` w głównym froncie: logowanie, lista, dodawanie/edycja ze zdjęciem, usuwanie — z tokenem sprawdzanym w backendzie.

**Architecture:** Mały endpoint `GET /api/users/me` w backendzie PHP. Panel jako lazy-loaded trasa `/mawexadmin` poza układem strony; kontekst sesji (sessionStorage + weryfikacja `getMe`), moduł API na axios zwracający `{ok,status,data,message,unauthorized}`, komponenty na `react-final-form` i SCSS modules.

**Tech Stack:** backend PHP 8.4 (bez zmian w stacku); front CRA 5, React 18, react-router-dom 6, react-final-form 6.5, axios 1.x, Jest + @testing-library/react 13 + user-event 13 (API synchroniczne: `userEvent.type`, `userEvent.click`, `userEvent.upload`).

**Spec:** `docs/superpowers/specs/2026-11-19-mawexadmin-panel-design.md` (w tym repo)

## Global Constraints

- **Bez commitów** — właściciel commituje sam. Każdy task kończy się „Zostaw bez commita”.
- Dwa repo: `../mawex-back-app` (Task 1) i to repo (`mawex-front-context`, Task 2–7), gałąź `feat/mawexadmin` w obu (utworzyć na starcie z aktualnego `main`/`feat/php-backend` — patrz Task 0).
- Zero nowych zależności npm.
- `REACT_APP_URL_TO_BACKEND` = `/api/` w buildzie produkcyjnym; `https://mawex-biuro.pl/api/` tylko do lokalnego testu na żywo.
- Klucz sessionStorage: `mawexAdminSession`, wartość JSON `{ "token": string, "user": { "id", "user", "access", "name" } }`.
- Komunikaty (verbatim): wygaśnięcie `"Sesja wygasła — zaloguj się ponownie"`; brak sieci `"Brak połączenia z serwerem"`; 401 w trakcie zapisu `"Sesja wygasła — skopiuj treść przed ponownym logowaniem"` + przycisk `"Zaloguj ponownie"`; wymagane pole `"Pole wymagane"`; zły typ pliku `"Dozwolone: JPG, PNG, WEBP, GIF"`; za duży `"Plik jest za duży (max 10 MB)"`; potwierdzenie usunięcia `Usunąć post „<tytuł>”?`.
- Upload po stronie klienta: typy `image/jpeg, image/png, image/webp, image/gif`, max `10 * 1024 * 1024` B. `imgPath = "images/blog/" + fileName`.
- Formularz: wymagane `title`, `content1`, `userName`, `date`; przy nowym poście także zdjęcie. Domyślnie nowy: `date` = dzisiejsza data `YYYY-MM-DD` (lokalna), `userName` = `user.name`.
- `PUT` wysyła komplet pól `{id, title, content1, content2, link, userName, date, imgPath}`; `null` z bazy zamieniane na `''`.
- Lista od najnowszego (odwrócona kolejność z API), miniatura `/${imgPath}`.

## Review Focus

1. Podwójne kliknięcie „Zapisz” → dokładnie jeden upload i jeden zapis → `blocks double submit` (Task 5).
2. Upload się udał, zapis posta zwrócił 400/500 → formularz zostaje z treścią; ponowne „Zapisz” **nie** wgrywa zdjęcia drugi raz (użyje już zwróconego `fileName`) → `retry after failed save reuses uploaded file` (Task 5).
3. 401 w trakcie zapisu → formularz otwarty z treścią, komunikat i „Zaloguj ponownie”; sesja czyszczona dopiero po kliknięciu → `401 on save keeps form content until relogin` (Task 5).
4. Edycja posta z migracji z `content2: null`, `link: null` → pola puste (nie „null”), `PUT` wysyła `''` → `edit with null fields sends empty strings` (Task 5).
5. Brak sieci przy ładowaniu listy → komunikat + „Spróbuj ponownie”, bez crasha → `list network error shows retry` (Task 4).

---

## Struktura plików

```
../mawex-back-app/api/src/users.php      + handle_me()
../mawex-back-app/api/src/router.php     + GET /users/me
../mawex-back-app/tests/auth_test.php    + 2 testy
package.json                              + "jest.moduleNameMapper" dla axios
src/App.test.js                           zastąpiony testami routingu
src/App.js                                trasa /mawexadmin (lazy), ukrycie Footer/RodoBanner
public/robots.txt                         Disallow: /mawexadmin
src/utils/admin.utils.js (+ .test.js)     API panelu
src/contexts/admin-session.context.js (+ .test.js)
src/routes/admin-page/                    index.js, admin-page.component.jsx (+ .test.js), admin-page.module.scss
src/components/admin/login-form/          login-form.component.jsx, .module.scss, index.js
src/components/admin/post-list/           post-list.component.jsx, .module.scss, index.js
src/components/admin/post-form/           post-form.component.jsx (+ .test.js), .module.scss, index.js
src/components/admin/confirm-delete/      confirm-delete.component.jsx, index.js
```

Komponenty admina **nie** są dopisywane do `src/components/index.js` (barrel ładowany przez stronę publiczną — wciągnąłby je do głównej paczki); importy bezpośrednio ze ścieżek.

---

### Task 0: Gałęzie

- [ ] **Step 1:** W obu repo: `git status` czysty (poza artefaktami sandboksa w `mawex-back-app`), `git switch main && git pull` (jeśli właściciel scalił `feat/php-backend`; jeśli nie — wyjść z `feat/php-backend`), `git switch -c feat/mawexadmin`. Jeśli drzewo nie jest czyste — zatrzymaj się i zapytaj właściciela.

### Task 1: Backend — `GET /api/users/me`

**Files:** Modify `../mawex-back-app/api/src/users.php`, `../mawex-back-app/api/src/router.php`; Test `../mawex-back-app/tests/auth_test.php`

**Interfaces:**
- Consumes: `require_auth(PDO $db): int` (auth.php), `json_response`, `db`.
- Produces: `handle_me(array $config): never` → 200 `{"user": {"id": int, "user": string, "access": string, "name": string}}`; 401 jak `require_auth`.

- [ ] **Step 1: Testy** w `tests/auth_test.php`:
  - `test_me_returns_user_for_valid_token`: `$t = login_token();` → `GET /api/users/me` z `auth($t)` → 200, `json.user.user === 'admin@mawex.pl'`, `json.user.name === 'Test'`, `is_int(json.user.id)`, brak klucza `token` i `password_hash` w `json.user`.
  - `test_me_401_without_or_bad_token`: bez nagłówka → 401 `"Brak autoryzacji - zaloguj się ponownie"`; `auth(str_repeat('a', 64))` → 401; po `UPDATE tokens SET expires_at = NOW() - INTERVAL 1 MINUTE` → 401.
- [ ] **Step 2:** `bash tests/run.sh me` (sandbox wyłączony) → oba FAIL (404).
- [ ] **Step 3:** `handle_me` + trasa `GET /users/me` w `dispatch` (przed `empty_response(404)`).
- [ ] **Step 4:** `bash tests/run.sh` → wszystkie PASS (39).
- [ ] **Step 5:** Zostaw bez commita. (Wdrożenie w Task 7.)

### Task 2: Testy frontu działają + moduł API

**Files:** Modify `package.json`; Delete content of `src/App.test.js` (zastąpiony w Task 6 — na razie usuń plik); Create `src/utils/admin.utils.js`, `src/utils/admin.utils.test.js`

**Interfaces:**
- Produces (wszystkie zwracają `Promise<Result>`, nigdy nie rzucają):
  `Result = { ok: boolean, status: number, data: any, message: string|null, unauthorized: boolean }` — `status` 0 i `message: "Brak połączenia z serwerem"` przy braku odpowiedzi; `message` = `data.message` z backendu przy błędzie; `unauthorized` = `status === 401`.
  - `loginRequest(login, password)` → `POST users`, ok przy 200, `data` = `response.data.user`
  - `getMe(token)` → `GET users/me`, ok 200, `data` = `response.data.user`
  - `getPosts()` → `GET posts`, ok 200, `data` = `response.data.data` (tablica, kolejność z API)
  - `uploadPhoto(token, file)` → `POST posts/upload`, `FormData` z polem `file`, ok 201, `data` = `response.data.fileName`
  - `addPost(token, post)` → `POST posts/add`, ok 201, `data` = `response.data.data`
  - `updatePost(token, post)` → `PUT posts`, ok 202, `data` = `response.data.data`
  - `deletePost(token, id)` → `DELETE posts/${id}`, ok 200
  - Nagłówek `Authorization: Bearer ${token}` w wywołaniach z tokenem.

- [ ] **Step 1: Jest + axios:** w `package.json` dodaj `"jest": { "moduleNameMapper": { "^axios$": "axios/dist/node/axios.cjs" } }`. Usuń `src/App.test.js` (nieaktualny szablon CRA, nigdy nie przechodził).
- [ ] **Step 2: Testy** `src/utils/admin.utils.test.js` — `jest.mock('axios', …)` z fabryką zwracającą `create: () => instance`, `instance.request = jest.fn()`; asercje na argumencie `request` (`method`, `url`, `headers.Authorization`, `data`):
  - `login ok returns user` (200 `{status:200,user:{token:'t',name:'Ania'}}` → `{ok:true, data:{token:'t',name:'Ania'}}`)
  - `login 404 passes backend message` (→ `ok:false, status:404, message:'Login lub hasło się nie zgadza'`)
  - `getMe sends bearer token` (`headers.Authorization === 'Bearer abc'`, `url === 'users/me'`)
  - `uploadPhoto posts form data field file` (`data instanceof FormData`, `data.get('file') === file`, `url === 'posts/upload'`, ok przy 201, `data === '123-ab.jpg'`)
  - `401 marks unauthorized` (`deletePost` z 401 → `unauthorized:true, ok:false`)
  - `network error resolves with message` (`request` odrzuca `new Error('Network Error')` → `{ok:false,status:0,message:'Brak połączenia z serwerem'}`)
- [ ] **Step 3:** `CI=true npx react-scripts test --watchAll=false src/utils/admin.utils.test.js` → FAIL (brak modułu).
- [ ] **Step 4:** Implementuj `admin.utils.js`: jedna instancja `axios.create({ baseURL: \`${process.env.REACT_APP_URL_TO_BACKEND}\`, validateStatus: () => true })`, jedna wewnętrzna funkcja `call(config, okStatus, pick)`.
- [ ] **Step 5:** ten sam test → PASS. Zostaw bez commita.

### Task 3: Kontekst sesji

**Files:** Create `src/contexts/admin-session.context.js`, `src/contexts/admin-session.context.test.js`

**Interfaces:**
- Consumes: `loginRequest`, `getMe` (Task 2).
- Produces: `AdminSessionProvider({children})`, `useAdminSession()` →
  `{ status: 'checking'|'anonymous'|'authenticated', user, token, notice: string|null, login(login, password): Promise<{ok, message}>, logout(notice?: string): void }`.
  - Start: brak zapisu → `anonymous`; jest zapis → `checking` → `getMe(token)`: ok → `authenticated` (`user` z odpowiedzi); `unauthorized` → czyści storage, `anonymous`, `notice = "Sesja wygasła — zaloguj się ponownie"`; inny błąd (np. sieć) → `anonymous`, `notice = message`, storage **nie** czyszczony.
  - `login` ok → zapis do storage, `authenticated`, `notice = null`; błąd → zwraca `{ok:false, message}`, stan bez zmian.
  - `logout(notice)` → czyści storage, `anonymous`, `notice` = argument lub `null`.
  - Uszkodzony JSON w storage → traktuj jak brak zapisu (i usuń klucz).

- [ ] **Step 1: Testy** (konsument testowy renderujący `status`, `notice`, `user?.name`; `jest.mock('../utils/admin.utils', () => ({ loginRequest: jest.fn(), getMe: jest.fn() }))`; `sessionStorage.clear()` w `beforeEach`):
  - `no stored session is anonymous` (getMe nie wołane)
  - `stored session shows checking then authenticated` (najpierw `checking`, po `getMe` ok → `authenticated`, imię z odpowiedzi getMe)
  - `stored token rejected by backend logs out with notice` (getMe → `unauthorized:true` → `anonymous`, tekst „Sesja wygasła — zaloguj się ponownie”, `sessionStorage.getItem('mawexAdminSession') === null`)
  - `forged storage value never reaches authenticated` (storage `'{"token":"x","user":{"name":"Hacker"}}'`, getMe → 401 → nigdy nie wyrenderowano `authenticated`)
  - `corrupt storage is ignored` (storage `'nie-json'` → `anonymous`, klucz usunięty)
  - `login stores session` / `logout clears session with notice`
- [ ] **Step 2:** run → FAIL. **Step 3:** implementuj. **Step 4:** run → PASS. **Step 5:** Zostaw bez commita.

### Task 4: Ekran panelu — logowanie, lista, usuwanie

**Files:** Create `src/routes/admin-page/{index.js, admin-page.component.jsx, admin-page.module.scss, admin-page.test.js}`, `src/components/admin/login-form/*`, `src/components/admin/post-list/*`, `src/components/admin/confirm-delete/*`

**Interfaces:**
- Consumes: `useAdminSession`, `AdminSessionProvider` (Task 3); `getPosts`, `deletePost` (Task 2); `Modal`, `Button`, `Spinner` z `src/components/<name>` (import bezpośredni, nie z barrela).
- Produces: `AdminPage` (default export z `admin-page.component.jsx`) — owija treść w `AdminSessionProvider`; `src/routes/admin-page/index.js` eksportuje `default`. Wewnątrz: `status==='checking'` → `Spinner`; `anonymous` → `LoginForm`; `authenticated` → nagłówek „Panel Mawex — blog”, `user.name`, „Wyloguj”, „+ Dodaj post”, `PostList`. Otwarcie formularza: stan `editing` (`null` | `'new'` | post), renderuje `PostForm` z Task 5 (w tym tasku placeholder `null`).
  - `PostList({ posts, onEdit(post), onDelete(post) })` — kolejność od najnowszego robi `AdminPage` (`[...data].reverse()`).
  - Każde `unauthorized` z `getPosts`/`deletePost` → `logout("Sesja wygasła — zaloguj się ponownie")`.
  - Dark mode: korzeń panelu bierze `isDarkModeActive` z `DarkModeContext` i przełącza klasę `wrapper`/`wrapperDark`, jak inne strony (np. `blog-page`). Przełącznika w panelu nie ma.

- [ ] **Step 1: Testy** `admin-page.test.js` (mock `../../utils/admin.utils` z fabryką; storage z ważną sesją + `getMe` ok tam, gdzie potrzeba):
  - `shows login form when anonymous` → pola „Login”, „Hasło”, przycisk „Zaloguj”
  - `login error shows backend message`
  - `authenticated shows posts newest first` (getPosts → `[A(id1), B(id2)]` → pierwszy wiersz to B)
  - `list network error shows retry` (getPosts → `{ok:false,status:0,message:'Brak połączenia z serwerem'}` → komunikat + „Spróbuj ponownie”; klik → `getPosts` wołane drugi raz)
  - `delete asks for confirmation` (klik „Usuń” przy B → tekst `Usunąć post „B”?`; „Anuluj” → `deletePost` nie wołane; ponownie + „Usuń” w modalu → `deletePost(token, 2)`, wiersz B znika)
  - `401 on delete returns to login with notice`
  - `logout returns to login`
  - Uwaga: `Modal` renderuje portal do `#modal` — w testach dodaj `<div id="modal">` do `document.body` w `beforeEach`.
- [ ] **Step 2:** run → FAIL. **Step 3:** implementuj (SCSS: zmienne z `src/global-styles/variables.scss`, układ działa na szerokości telefonu). **Step 4:** run → PASS. **Step 5:** Zostaw bez commita.

### Task 5: Formularz dodawania / edycji

**Files:** Create `src/components/admin/post-form/{post-form.component.jsx, post-form.module.scss, index.js, post-form.test.js}`; Modify `src/routes/admin-page/admin-page.component.jsx` (podpięcie)

**Interfaces:**
- Consumes: `uploadPhoto`, `addPost`, `updatePost` (Task 2); `Modal`, `Button`.
- Produces: `PostForm({ post, token, defaultUserName, onSaved(savedPost), onCancel(), onUnauthorized() })` — `post` = `null` (nowy) albo obiekt z API. `onSaved` dostaje `data` z odpowiedzi; `AdminPage` podmienia/dopisuje element listy lokalnie i zamyka modal. `onUnauthorized` wołane **dopiero** po kliknięciu „Zaloguj ponownie”.
  - Pola z etykietami: „Zdjęcie”, „Tytuł”, „Tekst 1”, „Tekst 2”, „Link do artykułu”, „Podpis”, „Data”.
  - Zapis: jeśli wybrano plik i nie ma jeszcze `uploadedFileName` → `uploadPhoto`; potem `addPost`/`updatePost` z `imgPath`. `uploadedFileName` trzymany w stanie formularza (patrz Review Focus 2). W trakcie: przycisk „Zapisz” `disabled`.
  - Podgląd: wybrany plik (`URL.createObjectURL`, zwolnij `revokeObjectURL` przy zmianie/odmontowaniu), przy edycji bez nowego pliku `/${post.imgPath}`.

- [ ] **Step 1: Testy** `post-form.test.js` (`URL.createObjectURL = jest.fn(() => 'blob:x')`, `URL.revokeObjectURL = jest.fn()`):
  - `new post requires photo and fields` (klik „Zapisz” bez niczego → „Pole wymagane” przy Tytuł/Tekst 1, komunikat o zdjęciu; żadne API nie wołane)
  - `new post defaults date and signature` (Data = dzisiejsze `YYYY-MM-DD`, Podpis = `defaultUserName`)
  - `new post uploads then adds with imgPath` (kolejność: `uploadPhoto` → `addPost(token, {…, imgPath:'images/blog/123-ab.jpg'})`; `onSaved` z `data`)
  - `edit without new photo keeps imgPath` (`updatePost` z `id` i dotychczasowym `imgPath`, `uploadPhoto` nie wołane)
  - `edit with null fields sends empty strings` (post `{content2:null, link:null}` → pola puste; `updatePost` z `content2:''`, `link:''`)
  - `rejects wrong file type and too big file` (`text/plain` → „Dozwolone: JPG, PNG, WEBP, GIF”; plik `size` > 10 MB → „Plik jest za duży (max 10 MB)”; upload nie wołany)
  - `blocks double submit` (`uploadPhoto` zwraca nierozwiązany jeszcze promise; dwa kliki „Zapisz” → `uploadPhoto` wołane 1×)
  - `retry after failed save reuses uploaded file` (`addPost` 1. raz `{ok:false,status:500,message:'X'}` → komunikat „X”, formularz z treścią; 2. „Zapisz” → `uploadPhoto` nadal 1×, `addPost` 2×)
  - `401 on save keeps form content until relogin` (`addPost` → `unauthorized` → tekst „Sesja wygasła — skopiuj treść przed ponownym logowaniem”, wpisany tytuł nadal w polu, `onUnauthorized` nie wołane; klik „Zaloguj ponownie” → wołane)
- [ ] **Step 2:** run → FAIL. **Step 3:** implementuj; w `AdminPage` `onUnauthorized` → `logout("Sesja wygasła — zaloguj się ponownie")`. **Step 4:** `CI=true npx react-scripts test --watchAll=false` → wszystkie PASS. **Step 5:** Zostaw bez commita.

### Task 6: Trasa, lazy-loading, ukrycie stopki, robots

**Files:** Modify `src/App.js`, `public/robots.txt`; Create `src/App.test.js`

**Interfaces:**
- Consumes: `src/routes/admin-page` (default export).
- `App.js`: `const AdminPage = lazy(() => import('./routes/admin-page'))`; `<Route path="/mawexadmin/*" element={<Suspense fallback={<Spinner isOpen />}><AdminPage/></Suspense>} />` jako rodzeństwo `<Route path="/" …>`, przed nim. `RodoBanner` i `Footer` renderowane tylko gdy `!pathname.startsWith('/mawexadmin')` (`useLocation`). Nie importuj niczego z `routes/admin-page` statycznie.
- `robots.txt`: `User-agent: *` + `Disallow: /mawexadmin`.

- [ ] **Step 1: Testy** `src/App.test.js` (render `<MemoryRouter initialEntries={[path]}><DarkModeProvider><RodoProvider><ReservationProvider><App/>…`; mock `./utils/posts.utils` → `getAllPosts: jest.fn(() => Promise.resolve({data: []}))`, mock `./utils/admin.utils` jak w Task 4; jeśli `maps` lub inny komponent wymaga przeglądarkowych API — zamockuj ten moduł):
  - `admin route renders panel without site footer` (`/mawexadmin` → po `findByText('Zaloguj')`; brak tekstu charakterystycznego dla `Footer` — wybierz stały tekst ze `src/content/contact-content.js` używany w stopce)
  - `home still renders footer` (`/` → ten tekst obecny)
- [ ] **Step 2:** run → FAIL. **Step 3:** implementuj. **Step 4:** cała suite → PASS.
- [ ] **Step 5: Build i chunk:** `REACT_APP_URL_TO_BACKEND=/api/ npm run build` → sukces; `grep -l "Panel Mawex" build/static/js/main.*.js` → **brak**; `grep -l "Panel Mawex" build/static/js/*.chunk.js` → jeden plik. Zostaw bez commita.

### Task 7: Wdrożenie z właścicielem

- [ ] **Step 1: Backend:** w `../mawex-back-app`: `node deploy/upload-api.js` (sandbox wyłączony) → „OK — wgrano …”; `curl -s -o /dev/null -w '%{http_code}' https://mawex-biuro.pl/api/users/me` → `401`.
- [ ] **Step 2: Test na żywo (decyzja właściciela, spec „Weryfikacja”):** właściciel uruchamia w terminalu `REACT_APP_URL_TO_BACKEND=https://mawex-biuro.pl/api/ npm start`, wchodzi na `http://localhost:3000/mawexadmin`: logowanie → dodanie posta „TEST – usuń” ze zdjęciem → widoczny na `https://mawex-biuro.pl/blog` → edycja tytułu → usunięcie; odświeżenie karty z sesją → panel bez ponownego logowania; zamknięcie karty → wylogowany. Wykonawca potem usuwa przez FTP plik zdjęcia testowego z `public_html/images/blog/` (nazwa z listingu: najnowszy `^\d{10}-[0-9a-f]{16}\.(jpg|jpeg|png|webp|gif)$` utworzony w trakcie testu — potwierdź nazwę z właścicielem przed usunięciem).
- [ ] **Step 3: Front:** właściciel buduje (`REACT_APP_URL_TO_BACKEND=/api/ npm run build`) i wgrywa `build/` przez FTP z nadpisaniem, bez kasowania. Wykonawca: `curl -s -o /dev/null -w '%{http_code}' https://mawex-biuro.pl/mawexadmin` → 200; `curl -s https://mawex-biuro.pl/robots.txt` zawiera `Disallow: /mawexadmin`; główny `main.*.js` z produkcji nie zawiera „Panel Mawex”.
- [ ] **Step 4:** Właściciel wyłącza stary `mawex-front-admin`. Aktualizacja `../mawex-back-app/CLAUDE.md` (sekcja Deployment: panel istnieje pod `/mawexadmin`, endpoint `users/me`). Zostaw bez commita; podaj właścicielowi komendy `git add` z listą plików dla obu repo.
