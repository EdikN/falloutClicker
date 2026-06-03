// === ДОНАТ-ПАКИ АРХИВА (IAP) ===
// Покупка мета-валюты за реал/GAM через Playgama. Единый источник для отображения
// (archiveScreen) и начисления (applyPurchase) — амаунты не дублируются.
//
// grants — что зачисляется в metaState при успешной покупке.
// fallback — цена-заглушка, пока продукт не зарегистрирован в каталоге платформы.
// icon — файл из public/img/payments/.
//
// ВАЖНО: продукты с этими id должен завести разработчик в кабинете платформы
// (Playgama / VK / Yandex). До регистрации показывается fallback и покупка не пройдёт.

export const META_SHOP = [
  {
    id: 'meta_memory_small', icon: 'energy.webp', fallback: '99 GAM',
    grants: { memoryPoints: 60 },
    name_ru: 'ОЧКИ ПАМЯТИ ×60', name_en: 'MEMORY POINTS ×60',
    desc_ru: 'Фрагменты сознания прошлых клонов. Хватит на пару узлов.',
    desc_en: 'Consciousness fragments of past clones. Enough for a couple of nodes.'
  },
  {
    id: 'meta_memory_large', icon: 'food.webp', fallback: '199 GAM',
    grants: { memoryPoints: 180 },
    name_ru: 'ОЧКИ ПАМЯТИ ×180', name_en: 'MEMORY POINTS ×180',
    desc_ru: 'Большой архив воспоминаний. Выгоднее малого пака.',
    desc_en: 'A large memory archive. Better value than the small pack.'
  },
  {
    id: 'meta_dna_pack', icon: 'ammunition.webp', fallback: '199 GAM',
    grants: { dnaFragments: 6 },
    name_ru: 'ДНК-ФРАГМЕНТЫ ×6', name_en: 'DNA FRAGMENTS ×6',
    desc_ru: 'Редкий генетический материал для сильных узлов и архетипов.',
    desc_en: 'Rare genetic material for strong nodes and archetypes.'
  },
  {
    id: 'meta_keys_pack', icon: 'repair.webp', fallback: '149 GAM',
    grants: { archiveKeys: 4 },
    name_ru: 'АРХИВНЫЕ КЛЮЧИ ×4', name_en: 'ARCHIVE KEYS ×4',
    desc_ru: 'Открывают секретные записи Архива.',
    desc_en: 'Unlock the secret records of the Archive.'
  },
  {
    id: 'meta_bundle', icon: 'weapons.webp', fallback: '349 GAM',
    grants: { memoryPoints: 180, dnaFragments: 6, archiveKeys: 4 },
    name_ru: 'НАБОР АРХИВИСТА', name_en: 'ARCHIVIST BUNDLE',
    desc_ru: 'Всё сразу со скидкой: память, ДНК и ключи.',
    desc_en: 'Everything at once, discounted: memory, DNA and keys.'
  }
];
