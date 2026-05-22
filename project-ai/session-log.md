# Session log

Хронологический журнал важного контекста по сессиям с AI-агентами.
Не правила, не контракт — фактический след того, что обсуждалось,
что было решено и что осталось открытым.

## Правила ведения

- Новые секции добавляются **в конец** файла, старые не редактируются.
- Заголовок секции: `## <YYYY-MM-DD HH:MM UTC> — <короткий заголовок>`.
- Заполняется через слеш-команду `/save-context` (см.
  `.opencode/commands/save-context.md`). Ручные правки тоже допустимы,
  но придерживайтесь шаблона из команды.
- Этот файл **намеренно не включён** в обязательный reading list
  `AGENTS.md`. Агент читает его только по явному запросу пользователя
  («подними контекст прошлой сессии», «посмотри session-log» и т.п.).
- Не дублируйте сюда правила из `AGENTS.md` и `project-ai/*.md`. Сюда
  попадают только факты конкретной сессии.

## Записи

<!-- Сюда /save-context будет дописывать секции вида:

---

## 2026-05-20 12:00 UTC — Короткий заголовок

**Ветка:** main
**Базовый коммит:** abc1234 commit subject

### Что обсуждали / какую задачу решали
...

### Что сделано
- ...

### Принятые решения
- ...

### Открытые вопросы / TODO
- ...

### Затронутые файлы
- ...

-->

---

## 2026-05-22 13:55 UTC — Аутентификация: формы, мок-бекенд, контракт

**Ветка:** development
**Базовый коммит:** 7e0410f feat: всякие приколдесы, новые странички, хедер поправил

### Что обсуждали / какую задачу решали

Реализовать формы входа и регистрации до появления реального бекенда.
Регистрация — двухшаговая с кодом подтверждения на email; вход — простой
email/password. Договорились о контракте API с `challengeId`, мок-роутах
внутри `app/api/auth/*`, HTTP-only cookie-сессии, табах через
переключение роутов (а не клиентский UI-таб), middleware-заготовке без
активных матчей. После сборки фронта пользователь попросил отдельный
документ-инструкцию для будущего бекенд-разработчика, а затем — серию
объяснений по Zod-схемам, мутациям TanStack Query и trade-off-ам
рантайм-валидации.

### Что сделано

- Создано entity `user` (`src/entities/user/**`): схемы (`UserSchema`,
  `LoginInputSchema`, `RegisterStartInputSchema` с подтверждением
  пароля, `RegisterStartPayloadSchema`, `RegisterVerifyInputSchema`),
  `userKeys`, хуки `useMeQuery` / `useLoginMutation` /
  `useLogoutMutation` / `useRegisterStartMutation` /
  `useRegisterVerifyMutation`, server-only `getMe` в
  `entities/user/server.ts`.
- Добавлены feature-формы: `features/auth-login-form/` (простой
  email+password) и `features/auth-register-form/` (state-машина
  credentials → verify, OTP-инпут с обратным отсчётом, маппинг
  статусов 422/410/429/404 на тексты).
- Создан мок-бекенд в `src/app/api/auth/*`: `login`, `logout`, `me`,
  `register/start`, `register/verify`. Общая логика и in-memory store
  с scrypt-хешированием паролей и `globalThis`-кэшем (HMR-устойчив) —
  в `app/api/auth/_lib/store.ts`. Имя cookie `session` вынесено в
  `_lib/constants.ts` без `server-only`, чтобы его мог импортировать
  edge-middleware. Helper `_lib/session-cookie.ts` ставит/чистит
  cookie с правильными атрибутами.
- Перестроены страницы: удалена `src/app/login/page.tsx`, добавлены
  route group `src/app/(auth)/` с общим layout, страницами `/login` и
  `/register` (обе Server Components, `buildMetadata`, собственные
  `<h1>`, кросс-ссылки), серверный компонент-навигация
  `components/shared/auth-tabs.tsx`.
- В `sitemap.ts` добавлены `/login` и `/register`.
- Header: новый клиент-остров `components/layout/header-user.tsx`
  (подписан на `useMeQuery`, рендерит либо «Вход», либо имя + popover
  с logout); `header.tsx` подключает его вместо прежней статической
  ссылки на вход.
- Создан `src/middleware.ts` с пустым `matcher: []` (литерально, без
  `as`-каста — иначе Next.js не принимает) и комментарием, как
  включить защиту роутов в будущем.
- `src/shared/api/http.ts`: добавлен явный `credentials: 'include'` в
  fetch-инициализации, чтобы cookie ходила и при переносе API на
  другой хост (с CORS).
- Создан `backend-instructions.md` в корне репозитория: что из
  моковых файлов удалить при появлении реального бекенда, что
  оставить; полный контракт пяти эндпоинтов (request/response/статусы/
  TypeScript-типы), требования к cookie/CORS/формату ошибок,
  чек-лист для бекенд-разработчика, порядок переключения фронта.
- После реализации — серия объяснений в чате: что такое Zod-схемы и
  где они используются, что такое TanStack-мутации и как они
  взаимодействуют с кешем, почему рантайм-валидация нужна поверх TS,
  trade-off между «жёстким `parse`» и `.catch()/.optional()` для
  косметических полей.

### Принятые решения

- Контракт регистрации — с `challengeId`: фронт хранит id попытки в
  локальном state экрана, на втором шаге шлёт `{challengeId, code}`.
  Email/пароль между шагами по сети не передаются повторно.
- Табы Вход/Регистрация — разные индексируемые роуты `/login` и
  `/register`, общий визуальный таб-свитчер (`AuthTabs`) рендерится
  как Server Component, активный таб приходит пропом из page (без
  `usePathname`, без `'use client'` на верхнем уровне).
- Имя cookie сессии зафиксировано — `session`. Атрибуты: `HttpOnly`,
  `SameSite=Lax`, `Secure` на проде, `Path=/`, `Max-Age=7d`.
- Сессия пользователя на фронте живёт только в TanStack Query
  (`userKeys.me()`), никакого Zustand-persist и localStorage.
- Middleware подготовлен, но `matcher` пустой — защищённых роутов
  пока нет, в комментарии описано, как добавить (`/dashboard/:path*`,
  `/tenders/new` и т.п.) когда понадобится.
- Документ для бекенда лежит в корне (`backend-instructions.md`), а
  не в `project-ai/` — это референс/контракт, не правило сессии.
  В `project-ai/` ничего по этому поводу не добавлялось.
- Жёсткий `UserSchema.parse(...)` для текущих полей оставили как
  есть; зафиксировано, что в будущем стоит сделать `name` и
  `createdAt` мягкими через `.catch(...)`, чтобы поломка
  косметического поля не выкидывала юзера из сессии.

### Открытые вопросы / TODO

- Пересмотреть жёсткость `UserSchema`: поставить `.catch()` на
  косметические поля (`name`, `createdAt`), оставить жёстким то, что
  влияет на логику/безопасность.
- Реальный email-провайдер для отправки кода: сейчас в моке код
  печатается в `console.log` route-обработчика `register/start` —
  на проде это недопустимо.
- В моковом `_lib/store.ts` для регистрации используется scrypt; в
  `backend-instructions.md` указано, что бекенду стоит брать
  argon2id. На фронт это не влияет.
- Когда появятся защищённые роуты — наполнить `matcher` в
  `src/middleware.ts` и проверить редирект на `/login?from=...`.
- Файл `siteConfig.loginHref` ('/login') больше нигде не
  используется (header переключён на `HeaderUser`); решить, оставлять
  ли его в конфиге.

### Затронутые файлы

- `project-ai/ui-rules.md` (M)
- `src/app/globals.css` (M)
- `src/app/login/page.tsx` (D)
- `src/app/sitemap.ts` (M)
- `src/components/layout/header-nav.tsx` (M)
- `src/components/layout/header.tsx` (M)
- `src/components/ui/dialog.tsx` (M)
- `src/components/ui/navigation-menu.tsx` (M)
- `src/components/ui/select.tsx` (M)
- `src/shared/api/http.ts` (M)
- `backend-instructions.md` (новый)
- `src/app/(auth)/layout.tsx` (новый)
- `src/app/(auth)/login/page.tsx` (новый)
- `src/app/(auth)/register/page.tsx` (новый)
- `src/app/api/auth/_lib/constants.ts` (новый)
- `src/app/api/auth/_lib/session-cookie.ts` (новый)
- `src/app/api/auth/_lib/store.ts` (новый)
- `src/app/api/auth/login/route.ts` (новый)
- `src/app/api/auth/logout/route.ts` (новый)
- `src/app/api/auth/me/route.ts` (новый)
- `src/app/api/auth/register/start/route.ts` (новый)
- `src/app/api/auth/register/verify/route.ts` (новый)
- `src/components/layout/header-user.tsx` (новый)
- `src/components/shared/auth-tabs.tsx` (новый)
- `src/components/ui/popover.tsx` (новый)
- `src/entities/user/api/use-user.ts` (новый)
- `src/entities/user/api/user.fetchers.ts` (новый)
- `src/entities/user/api/user.keys.ts` (новый)
- `src/entities/user/index.ts` (новый)
- `src/entities/user/model/user.schema.ts` (новый)
- `src/entities/user/server.ts` (новый)
- `src/features/auth-login-form/index.ts` (новый)
- `src/features/auth-login-form/ui/auth-login-form.tsx` (новый)
- `src/features/auth-register-form/index.ts` (новый)
- `src/features/auth-register-form/model/state.ts` (новый)
- `src/features/auth-register-form/ui/auth-register-form.tsx` (новый)
- `src/features/auth-register-form/ui/credentials-step.tsx` (новый)
- `src/features/auth-register-form/ui/verify-step.tsx` (новый)
- `src/middleware.ts` (новый)
