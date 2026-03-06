# План разработки Order Picker (Mobile First)

## 1. Обзор проекта
Веб-приложение для составления заказов инвентаря. Ориентировано на мобильные устройства (крупные кнопки, удобная навигация).
Основные функции:
- Главное меню (Новый заказ, История, Редактор товаров).
- Процесс заказа: список товаров с вводом количества.
- Цветовая индикация: выбранные товары (>0) подсвечиваются акцентным цветом.
- Summary: итоговый экран перед отправкой.
- Сохранение истории заказов в БД.

## 2. Технологический стек
- **Framework:** Next.js 15 (App Router).
- **Styling:** Tailwind CSS (Mobile First, Dark/Light mode).
- **State Management:** Zustand (для управления состоянием текущего заказа на клиенте).
- **Database:** Turso (libSQL) — облачная SQLite база данных.
- **ORM:** Drizzle ORM (для типизации и удобной работы с БД).
- **Icons:** Lucide React.

## 3. Дизайн и UX
- **Тема:** Поддержка темной и светлой темы (системная или переключатель).
- **Цветовая палитра:**
  - **Neutral:** Slate или Zinc (фон, текст).
  - **Accent:** Indigo или Violet (для кнопок действий и подсветки выбранных элементов).
  - **Success:** Emerald (для подтверждения).
- **Интерфейс:**
  - Sticky Footer: Кнопка "Далее" / "Итого" всегда доступна внизу экрана.
  - Input: Крупные кнопки `+` и `-`, а также поле для ручного ввода цифр.

## 4. Структура Базы Данных (Schema)

### Таблица `items` (Товары)
- `id`: integer (primary key, auto-increment)
- `external_id`: text (артикул из PDF, unique)
- `description`: text
- `unit`: text (CS, Case, BIB, etc.)
- `category`: text (optional)
- `is_active`: boolean (default true)

### Таблица `orders` (Заказы)
- `id`: integer (primary key)
- `created_at`: timestamp
- `status`: text (draft, completed)
- `total_items_count`: integer

### Таблица `order_items` (Состав заказа)
- `id`: integer (primary key)
- `order_id`: integer (foreign key)
- `item_id`: integer (foreign key)
- `quantity`: real

## 5. Этапы разработки

### Этап 1: Инициализация и Настройка
1. Создание проекта Next.js.
2. Настройка Tailwind CSS.
3. Установка зависимостей (Zustand, Drizzle, Turso client).
4. Настройка подключения к Turso.
5. Создание схемы БД и миграция (Seed) данными из `items.json`.

### Этап 2: Главная страница и Навигация
1. Создание Layout (Header, Mobile Container).
2. Реализация Главной страницы с крупными карточками-ссылками:
   - "Начать новый заказ" -> `/order`
   - "История заказов" -> `/history`
   - "Товары" -> `/items`

### Этап 3: Логика заказа (Zustand + UI)
1. Создание Zustand Store (`useOrderStore`):
   - Хранение Map: `{ itemId: quantity }`.
   - Методы: `inc`, `dec`, `set`, `reset`.
2. Страница `/order`:
   - Получение списка товаров из БД (Server Component).
   - Компонент списка (`ItemList`).
   - Компонент элемента (`ItemRow`):
     - Если `quantity > 0`: фон `bg-indigo-50` (light) / `bg-indigo-900/20` (dark), рамка акцентная.
     - Если `quantity === 0`: стандартный стиль.
   - Sticky Footer с кнопкой "Просмотр (X поз.)".

### Этап 4: Страница Summary и Отправка
1. Страница `/order/summary`:
   - Фильтрация списка (только где `qty > 0`).
   - Кнопка "Подтвердить заказ".
2. Server Action `submitOrder`:
   - Запись данных в таблицы `orders` и `order_items` в Turso.
   - Редирект на главную с уведомлением об успехе.

### Этап 5: История и Админка
1. Страница `/history`:
   - Список последних заказов (дата, кол-во позиций).
   - Детальный просмотр заказа (Read-only).
2. Страница `/items` (Редактор):
   - Простой список всех товаров.
   - Возможность скрыть товар (`is_active = false`) или изменить название.

## 6. Следующие шаги
- [ ] Инициализировать проект.
- [ ] Настроить Turso и загрузить данные.
- [ ] Начать верстку.
