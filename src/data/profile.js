// ─────────────────────────────────────────────────────────────
//  Весь контент сайта живёт здесь. Меняй значения — сайт обновится.
// ─────────────────────────────────────────────────────────────

export const profile = {
  // Имя крупно на первом экране (готический шрифт; кириллица тоже работает)
  name: 'thomasiano',
  // Строка под именем
  role: 'Студент-программист',
  // Короткий слоган / цитата
  tagline: 'Nox, code, repeat.',
  location: 'open to work',

  // Ник на GitHub — от него строится виджет активности и статистика
  githubUsername: 'thomasidze',

  // Фоновые сцены: файлы лежат в /public/bg. Поддерживается .gif, .mp4, .webm
  // (mp4 весит в разы меньше — см. README). Сцены плавно сменяют друг друга при прокрутке.
  // from — с какой доли прокрутки (0…1) сцена проявляется; brightness — яркость (1 = как есть).
  // Можно оставить одну сцену или указать null — тогда будет только туман.
  background: [
    { src: '/bg/cross.mp4', poster: '/bg/cross.jpg', position: '35% 40%', brightness: 0.85 },
    { src: '/bg/graveyard.mp4', poster: '/bg/graveyard.jpg', position: '50% 60%', from: 0.88 },
  ],

  // Фото для блока «Обо мне». null — будет монограмма из первой буквы имени.
  avatar: null, // например: '/me.jpg'

  about: [
    'Привет! Я thomasiano — студент первого курса направления «Информатика и вычислительная техника».',
    'Почти всё свободное время я провожу за компьютером — так и затянуло в программирование. Сейчас изучаю C#, C, JavaScript и React, пишу разные проекты и делаю игры.',
    'В разработке активно использую ИИ — в первую очередь Claude Code: с ним быстрее собирать прототипы, разбираться в новых технологиях и доводить проекты до релиза.',
  ],

  facts: [
    { label: 'Учёба', value: 'ИВТ, 1 курс' },
    { label: 'Изучаю', value: 'C#, C, React' },
    { label: 'Делаю', value: 'Игры и пет-проекты' },
  ],

  skills: ['Python', 'C#', 'C', 'JavaScript', 'React', 'HTML / CSS', 'Godot', 'Claude Code'],

  contacts: [
    { type: 'github', label: 'GitHub', href: 'https://github.com/thomasidze' },
    { type: 'telegram', label: 'Telegram', href: 'https://t.me/thomasiano' },
    // почта частями — сайт склеит её сам (защита от спам-ботов)
    { type: 'email', user: 'thomasiano', domain: 'mail.ru' },
  ],
}

// status: 'dev' — в разработке, 'live' — вышел и обновляется, 'done' — завершён. version — необязательная подпись (например 'v0.7').
export const projects = [
  {
    title: 'White Noise',
    year: '2026',
    status: 'live',
    version: 'v0.7',
    description:
      'Хоррор от первого лица про последнюю неделю полярной ночи на арктической метеостанции. Держишь генератор, передаёшь сводки по рации и стараешься не слушать ночной канал: на 4870 кГц кто-то знает твоё имя.',
    tags: ['Godot 4', 'GDScript', '3D'],
    image: '/projects/white-noise.jpg',
    github: null,
    demo: 'https://thomasiano.itch.io/white-noise',
    demoLabel: 'Скачать на itch.io',
  },
  {
    title: 'Deep Dive',
    year: '2026',
    status: 'live',
    description:
      'Игра в Roblox: ныряешь в океан, ловишь морских существ и строишь аквариум, который приносит доход. Чем глубже зона, тем реже улов. А ещё можно пробраться на чужую базу и украсть лучших рыб.',
    tags: ['Roblox', 'Luau', 'Rojo'],
    image: '/projects/deep-dive.jpg',
    github: null,
    demo: 'https://www.roblox.com/games/88320958903596',
    demoLabel: 'Играть в Roblox',
  },
  {
    title: 'Avito Parser',
    year: '2026',
    status: 'dev',
    description:
      'Telegram-бот, который присылает новые объявления Авито по сохранённым поискам. Фильтры по цене и стоп-словам, планировщик проверок, пул прокси, подписка через Telegram Stars и админ-панель.',
    tags: ['Python', 'aiogram', 'SQLAlchemy', 'SQLite'],
    image: null,
    github: null,
    demo: null,
  },
  {
    title: 'Народный детейлер',
    year: '2026',
    status: 'done',
    description:
      'Лендинг школы детейлинга. Статичный сайт без бэкенда: заявки из формы уходят в Telegram через Cloudflare Worker, а токен бота не попадает на сайт.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Cloudflare Workers'],
    image: '/projects/detailer.jpg',
    github: null,
    demo: 'https://narodny-detailer.pages.dev/',
    demoLabel: 'Открыть сайт',
  },
]
