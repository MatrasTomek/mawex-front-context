# Panel admina bloga `/mawexadmin` w głównym froncie

Data: 2026-11-19

## Cel i powód

Właściciel dodaje posty na blog mawex-biuro.pl co kilka dni. Do 2026-11-19 robił to
osobną aplikacją `mawex-front-admin`, która po przeniesieniu backendu na PHP/MySQL
(dhosting, `https://mawex-biuro.pl/api/`) jest martwa: gada ze starym backendem
i starą bazą. Od przełączenia posty da się dodawać tylko przez phpMyAdmin.

Panel ma zamieszkać w głównym froncie (`mawex-front-context`) jako trasa
`/mawexadmin` — jeden projekt do utrzymania zamiast dwóch. Zakres: **to samo co
stary panel, z prawdziwym zabezpieczeniem** (słowa właściciela).

Projekt 2 z 2 po migracji backendu; kontekst:
`../mawex-back-app/docs/superpowers/specs/2026-11-19-php-backend-dhosting-design.md`.

## Stan obecny (ustalony)

- Główny front: CRA 5 (react-scripts), React 18, `react-router-dom` 6
  (`BrowserRouter`), konteksty Reacta (`src/contexts/*`), `react-final-form`
  w formularzach, axios w `src/utils/*.utils.js` z `validateStatus: () => true`,
  SCSS modules + `src/global-styles/`, dark mode przez `DarkModeContext`.
- `App.js`: wszystkie trasy są dziećmi `<Route path="/" element={<Navigation/>}>`
  (menu), na końcu `path="*"` → `Navigate to "/"`. `RodoBanner` i `Footer`
  renderowane **poza** `<Routes>`, czyli na każdej stronie.
- Istniejące komponenty do użycia: `Button`, `Modal` (portal do `#modal`),
  `Spinner`.
- Stary panel (`../mawex-front-admin`, Redux + Formik) — wzorzec funkcji:
  logowanie; lista postów z edycją i usuwaniem; modal dodawania/edycji
  z polami: zdjęcie, tytuł, tekst 1, tekst 2, link, podpis, data
  (`<input type="date">` → `YYYY-MM-DD`); `imgPath = "images/blog/<fileName>"`.
  Jego „zabezpieczenie” było tylko po stronie przeglądarki.
- Backend (bez zmian w tym projekcie), baza `REACT_APP_URL_TO_BACKEND=/api/`:

  | Wywołanie | Auth | Sukces | Błędy |
  |---|---|---|---|
  | `POST users {login,password}` | — | 200 `{status, user:{id, token, loginId, user, access, name}}` | 404 `{message}` |
  | `GET posts` | — | 200 `{data:[post…]}` najstarszy pierwszy | 500 |
  | `POST posts/add {title,content1,content2,link,userName,date,imgPath}` | token | 201 `{data:post}` | 400, 401 |
  | `PUT posts {id, …wszystkie pola}` | token | 202 `{data:post}` | 400, 404, 401 |
  | `DELETE posts/{id}` | token | 200 (puste) | 404, 401 |
  | `POST posts/upload` multipart `file` | token | 201 `{fileName}` | 400 `{message}`, 401 |

  `post = {_id (int), title, content1, content2, link, userName, date, imgPath}`.
  Token: nagłówek `Authorization: Bearer <token>`, ważny 12 h; wymagane
  `title`, `userName`, `date` (inaczej 400). `PUT` nadpisuje **wszystkie** pola.
  Upload: jpg/jpeg/png/webp/gif, ≤ 10 MB.

## Cele

1. `/mawexadmin`: logowanie istniejącym kontem, lista postów, dodawanie,
   edycja, usuwanie, upload zdjęcia — parytet ze starym panelem.
2. Prawdziwe zabezpieczenie: wszystkie zapisy z tokenem; UI admina widoczny
   tylko z tokenem, który backend zaakceptował; każde 401 → powrót do
   logowania z komunikatem.
3. Kod panelu nie trafia do paczki pobieranej przez zwykłych odwiedzających.

## Nie-cele

- Zmiany w backendzie poza jednym endpointem `GET users/me` (patrz Sesja).
- Zarządzanie kontami, zmiana hasła, wiele ról.
- Usuwanie pliku zdjęcia z serwera przy usuwaniu posta / zmianie zdjęcia
  (backend tego nie robi; pliki zostają w `images/blog/`).
- Edytor WYSIWYG, podgląd posta, szkice, paginacja, wyszukiwarka.
- Archiwizacja postów do `posts-YYYY.json`.
- Zmiany na publicznych stronach poza ukryciem stopki/banera RODO na
  `/mawexadmin`.

## Anty-cele

- Panel, który po wygaśnięciu tokenu dalej „działa” i tylko sypie błędami.
- Możliwość zobaczenia/użycia formularzy zapisu bez ważnego tokenu (np. przez
  wpisanie czegoś do sessionStorage).
- Utrata wpisanej treści posta przez błąd uploadu albo wygasłą sesję bez
  ostrzeżenia.
- Zwiększenie rozmiaru głównej paczki JS dla odwiedzających o kod panelu.

## Podejścia

1. **Wybrane — trasa w głównym froncie na jego własnych narzędziach**:
   lazy-loaded `/mawexadmin` poza układem strony, kontekst sesji,
   `react-final-form`, axios jak w `utils/`, SCSS modules. Zero nowych
   zależności.
2. Przeniesienie starego panelu 1:1 (Redux + Formik) — odrzucone: dwie nowe
   biblioteki, drugi sposób zarządzania stanem, a auth i tak do przepisania.
3. Osobna mini-aplikacja (czysty HTML/JS obok API) — odrzucone: znowu drugi
   projekt, a celem było jedno miejsce.

## Projekt

### Trasa i układ (decyzja właściciela: osobny ekran, wariant B)

- W `App.js` trasa `/mawexadmin` jako **rodzeństwo** `<Route path="/" …>`
  (nie dziecko `Navigation`), dodana przed catch-all — bez menu strony.
- `RodoBanner` i `Footer` nie renderują się, gdy `pathname` zaczyna się od
  `/mawexadmin` (`useLocation`).
- Komponent panelu ładowany przez `React.lazy` + `Suspense` (fallback:
  istniejący `Spinner`) — osobny chunk JS.
- `public/robots.txt`: `Disallow: /mawexadmin` (decyzja projektanta).

```
┌──────────────────────────────────────────┐
│ Panel Mawex — blog          Ania [Wyloguj]│
├──────────────────────────────────────────┤
│ [+ Dodaj post]                            │
│ ┌────┐ Tytuł najnowszego posta            │
│ │img │ 2026-11-17 · Ania   [Edytuj][Usuń] │
│ └────┘                                    │
│ ┌────┐ Tytuł starszego posta …            │
└──────────────────────────────────────────┘
```

### Sesja (decyzje projektanta)

- `AdminSessionContext` (provider tylko wewnątrz panelu): `{ user, token,
  login(login, password), logout(message?) }`.
- *Dopisane 2026-11-21:* przycisk „Wyloguj” woła `signOut()` — wysyła w tle
  `DELETE users/me` (backend usuwa token z bazy) i od razu czyści sesję
  lokalną, bez czekania na odpowiedź. Przy wygaśnięciu sesji (401) zostaje samo
  `logout(message)`, bez żądania.
- Token i `user` (`name`, `user`) w `sessionStorage` (klucz np.
  `mawexAdminSession`) — przetrwa odświeżenie, znika po zamknięciu karty;
  jak stary panel.
- **Token z sessionStorage nie wystarcza, żeby zobaczyć panel** (cel 2,
  anty-cel): przy starcie panelu kontekst sprawdza go w backendzie
  i do czasu odpowiedzi pokazuje spinner. Dopiero 200 pokazuje listę
  i formularze; 401 czyści sesję i pokazuje logowanie z komunikatem
  „Sesja wygasła — zaloguj się ponownie”. Każde późniejsze 401 z dowolnego
  zapytania robi to samo.
- **Nowy endpoint w backendzie (decyzja projektanta po recenzji)**:
  `GET /api/users/me` z `Authorization: Bearer <token>` → 200
  `{user:{id, user, access, name}}` dla ważnego tokenu, 401 `{message}`
  inaczej (ten sam komunikat co `require_auth`). Kilka linii w
  `mawex-back-app/api/src/users.php` + trasa w `router.php` + testy
  w `tests/auth_test.php`; wdrożenie `npm run deploy`. Odrzucona
  alternatywa: „sondowanie” istniejącego API (`DELETE posts/0` → 401/404) —
  działa bez zmian w backendzie, ale opiera się na kolejności sprawdzeń
  w `require_auth` i psuje się po cichu przy pierwszej zmianie tam.
- Wylogowanie: czyści sessionStorage i stan (tokenu po stronie serwera nie da
  się unieważnić — brak endpointu; wygaśnie po 12 h).

### Warstwa API (`src/utils/admin.utils.js`)

Instancja axios jak w `posts.utils.js` (`baseURL` z `REACT_APP_URL_TO_BACKEND`,
`validateStatus: () => true`). Funkcje przyjmują token i zwracają
`{ ok, status, data, message }`; status 401 sygnalizowany jednoznacznie, żeby
warstwa UI wywołała `logout("Sesja wygasła…")`. Funkcje: `loginRequest`, `getMe`,
`getPosts`, `uploadPhoto(file)`, `addPost`, `updatePost`, `deletePost`.
Błąd sieci (brak odpowiedzi) → `{ ok:false, message:"Brak połączenia z serwerem" }`,
nie wyjątek.

### Ekrany

- **Logowanie**: login + hasło (`react-final-form`, oba wymagane), komunikat
  z backendu przy 404 („Login lub hasło się nie zgadza” / „Użytkownik…”),
  ewentualny komunikat o wygaśnięciu sesji nad formularzem.
- **Lista**: `GET posts`, wyświetlana od najnowszego (odwrócona kolejność),
  miniatura `/${imgPath}`, tytuł, data, podpis, „Edytuj”, „Usuń”. Spinner
  w trakcie ładowania; komunikat przy błędzie z przyciskiem „Spróbuj ponownie”.
- **Usuwanie**: `Modal` z potwierdzeniem („Usunąć post „<tytuł>”?”) →
  `DELETE` → usunięcie z listy bez przeładowania.
- **Dodawanie / edycja** (jeden komponent formularza w `Modal`):
  - Pola: zdjęcie (`accept="image/jpeg,image/png,image/webp,image/gif"`),
    tytuł, tekst 1 (textarea), tekst 2 (textarea), link, podpis, data
    (`type="date"`).
  - Wymagane: tytuł, tekst 1, podpis, data; przy nowym poście zdjęcie.
    (Tekst 1 wymagany jak w starym panelu, choć backend go nie wymaga.)
  - Domyślnie przy nowym: data = dziś, podpis = `user.name` zalogowanego
    (decyzja projektanta; pole edytowalne).
  - **Zmiana względem starego panelu (decyzja projektanta)**: zdjęcie wybiera
    się w tym samym formularzu, wgrywa przy „Zapisz”: najpierw `upload`, potem
    `add`/`update` z `imgPath = "images/blog/<fileName>"`. Przy edycji bez
    nowego zdjęcia zostaje dotychczasowe `imgPath`. Podgląd wybranego zdjęcia
    (object URL) i obecnego przy edycji.
  - Walidacja po stronie klienta: typ (jw.) i rozmiar ≤ 10 MB przed wysłaniem,
    z czytelnym komunikatem.
  - Błąd uploadu lub zapisu: formularz zostaje otwarty z wpisaną treścią,
    komunikat z backendu nad przyciskami. Przy 401 w trakcie zapisu: treść
    formularza **nie przepada bez ostrzeżenia** — komunikat „Sesja wygasła —
    skopiuj treść przed ponownym logowaniem” i przycisk „Zaloguj ponownie”
    (dopiero on czyści sesję). (Decyzja projektanta realizująca anty-cel.)
  - `PUT` wysyła komplet pól (backend nadpisuje wszystkie).
  - Po sukcesie: modal się zamyka, lista aktualizuje się lokalnie z `data`
    z odpowiedzi (bez ponownego `GET`).
  - Zapis zablokowany w trakcie wysyłania (brak podwójnych postów).
- Dark mode: panel korzysta z `DarkModeContext` jak reszta strony
  (przełącznika w panelu nie ma — preferencja z localStorage).

### Struktura plików (propozycja; szczegóły builderowi)

```
src/routes/admin-page/            index.js (lazy export), admin-page.component.jsx, .module.scss
src/components/admin/…            login-form, post-list, post-form, confirm-delete
src/contexts/admin-session.context.js
src/utils/admin.utils.js
```

### Weryfikacja

- Testy Jest + React Testing Library (już w projekcie: `App.test.js`,
  `setupTests.js`) z zamockowanym modułem `admin.utils`: logowanie ok/błąd,
  zapisany, ale odrzucony token (`getMe` → 401) pokazuje logowanie, a nie
  formularze; spinner do czasu odpowiedzi `getMe`,
  401 → ekran logowania z komunikatem, dodanie z uploadem (kolejność wywołań,
  `imgPath`), edycja bez nowego zdjęcia zachowuje `imgPath`, potwierdzenie
  usunięcia, blokada podwójnego zapisu, walidacja pliku.
- Build `npm run build` — sprawdzenie, że kod panelu jest w osobnym chunku
  (`build/static/js/*.chunk.js`), a `main.*.js` nie zawiera np. tekstów panelu.
- **Przed wdrożeniem — krótki test na produkcyjnym API (decyzja właściciela)**:
  `REACT_APP_URL_TO_BACKEND=https://mawex-biuro.pl/api/ npm start` (CORS
  produkcji dopuszcza `http://localhost:3000`), w panelu: logowanie →
  dodanie posta „TEST – usuń” ze zdjęciem → sprawdzenie na
  `https://mawex-biuro.pl/blog` → edycja → usunięcie. Post jest widoczny
  publicznie ~1–2 min — akceptowane. Po teście usunąć jego zdjęcie
  z `public_html/images/blog/` przez FTP (backend nie kasuje plików).
  Wcześniej wdrożyć `GET users/me` w backendzie.
- Po wdrożeniu frontu: wejście na `/mawexadmin` z tokenem i bez, szybkie
  logowanie i wylogowanie (bez zapisów).

### Wdrożenie

Jak każdy front: `REACT_APP_URL_TO_BACKEND=/api/`, `npm run build`, wgranie
zawartości `build/` przez FTP z nadpisaniem, bez kasowania (zostają `api/`,
`images/`, `.htaccess`). Istniejący `public_html/.htaccess` już kieruje
`/mawexadmin` do `index.html`. Po wdrożeniu: wyłączenie starego
`mawex-front-admin` (właściciel).

## Decyzje projektanta (do sprawdzenia przez właściciela)

- Sesja w sessionStorage (zamknięcie karty = wylogowanie), sprawdzana przy
  starcie przez nowy `GET users/me`.
- Zdjęcie wybierane w tym samym formularzu i wgrywane przy „Zapisz”
  (zamiast osobnego „zapisz zdjęcie” jak w starym panelu).
- Domyślnie przy nowym poście: data = dziś, podpis = imię zalogowanego.
- Przy 401 w trakcie zapisu formularz zostaje otwarty z treścią i ostrzeżeniem.
- Kod panelu w osobnym pliku (lazy), `robots.txt` blokuje `/mawexadmin`.
- Na `/mawexadmin` nie ma stopki ani banera RODO.

## Zostawione builderowi

- Podział na komponenty i nazwy plików w ramach powyższej struktury.
- Wygląd szczegółowy (zgodny z `global-styles`, działa na telefonie).
- Dokładne brzmienie nowych komunikatów (po polsku).
