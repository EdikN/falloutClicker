export const WEAPON_STATS = {
    fists: { dmg: 4, cd: 0.2, name_ru: 'КУЛАКИ', name_en: 'FISTS', isGun: false },
    knife: { dmg: 8, cd: 0.25, name_ru: 'ЗАТОЧКА', name_en: 'SHANK', isGun: false },
    wrench: { dmg: 14, cd: 0.4, name_ru: 'ГАЕЧНЫЙ КЛЮЧ', name_en: 'WRENCH', isGun: false },
    pickaxe: { dmg: 24, cd: 0.5, name_ru: 'КИРКА-КЛИНОК', name_en: 'PICKAXE BLADE', isGun: false },
    shockrod: { dmg: 35, cd: 0.6, name_ru: 'ШОКОВЫЙ ЖЕЗЛ', name_en: 'SHOCK ROD', isGun: false },
    vibrofist: { dmg: 55, cd: 0.7, name_ru: 'ВИБРО-КУЛАК', name_en: 'VIBRO-FIST', isGun: false },
    pistol: { dmg: 18, cd: 0.3, name_ru: '10ММ ПИСТОЛЕТ', name_en: '10MM PISTOL', isGun: true },
    shotgun: { dmg: 35, cd: 0.7, name_ru: 'ДРОБОВИК', name_en: 'SHOTGUN', isGun: true },
    rifle: { dmg: 50, cd: 0.45, name_ru: 'ШТУРМ. ВИНТОВКА', name_en: 'ASSAULT RIFLE', isGun: true },
    plasma: { dmg: 80, cd: 0.8, name_ru: 'ПЛАЗМОГАН', name_en: 'PLASMA GUN', isGun: true },
    launcher: { dmg: 120, cd: 1.3, name_ru: 'ГРАНАТОМЕТ', name_en: 'GRENADE LAUNCHER', isGun: true },
    laserc: { dmg: 150, cd: 1.0, name_ru: 'ЛАЗЕРНАЯ ПУШКА', name_en: 'LASER CANNON', isGun: true }
  };

  export const ARMOR_STATS = {
    none: { name_ru: 'ЛОХМОТЬЯ', name_en: 'RAGS', hp: 0, armorClass: 0 },
    light: { name_ru: 'ЛЕГКАЯ БРОНЯ', name_en: 'LIGHT ARMOR', hp: 25, armorClass: 0.1 },
    medium: { name_ru: 'АРМЕЙСКИЙ БРОНИК', name_en: 'COMBAT ARMOR', hp: 50, armorClass: 0.25 },
    heavy: { name_ru: 'СИЛОВОЙ КАРКАС', name_en: 'POWER FRAME', hp: 100, armorClass: 0.45 }
  };

  export const SHOP_ITEMS = [
    { key: 'food', label_ru: '🍖 Паёк x5', label_en: '🍖 Ration x5', amount: 5, price: 20, type: 'resource' },
    { key: 'water', label_ru: '💧 Вода x5', label_en: '💧 Water x5', amount: 5, price: 30, type: 'resource' },
    { key: 'ammo', label_ru: '⚡ Патроны x14', label_en: '⚡ Ammo x14', amount: 14, price: 15, type: 'resource' },
    { key: 'medkits', label_ru: '✚ Стимулятор x1', label_en: '✚ Stimpak x1', amount: 1, price: 25, type: 'resource' },
    { key: 'weaponWrench', label_ru: '🔧 Гаечный ключ', label_en: '🔧 Wrench', price: 45, type: 'weapon', weaponId: 'wrench' },
    { key: 'weaponPistol', label_ru: '🔫 10мм Пистолет', label_en: '🔫 10mm Pistol', price: 85, type: 'weapon', weaponId: 'pistol' },
    { key: 'weaponShotgun', label_ru: '💥 Дробовик', label_en: '💥 Shotgun', price: 150, type: 'weapon', weaponId: 'shotgun' },
    { key: 'weaponRifle', label_ru: '🎯 Штурм. винтовка', label_en: '🎯 Assault Rifle', price: 250, type: 'weapon', weaponId: 'rifle' },
    { key: 'weaponPlasma', label_ru: '⚛️ Плазмоган', label_en: '⚛️ Plasmagun', price: 500, type: 'weapon', weaponId: 'plasma' },
    { key: 'armorLight', label_ru: '🛡️ Легкая броня', label_en: '🛡️ Light Armor', price: 100, type: 'armor', armorId: 'light' },
    { key: 'armorMedium', label_ru: '🔰 Армейский броник', label_en: '🔰 Combat Armor', price: 250, type: 'armor', armorId: 'medium' },
    { key: 'armorHeavy', label_ru: '🤖 Силовой каркас', label_en: '🤖 Power Frame', price: 600, type: 'armor', armorId: 'heavy' }
  ];

  export const CRAFT_ITEMS = [
    { label_ru: '🗡️ Заточка', label_en: '🗡️ Shank', desc_ru: 'Заострённый кусок арматуры. +3 урон.', desc_en: 'Sharpened rebar. +3 damage.', materials: 8, ammo: 0, unlock: 'knife', type: 'weapon' },
    { label_ru: '⛏️ Кирка-клинок', label_en: '⛏️ Pickaxe Blade', desc_ru: 'Тяжёлый модифицированный инструмент. +10 урон.', desc_en: 'Heavy modified tool. +10 damage.', materials: 20, ammo: 0, unlock: 'pickaxe', type: 'weapon' },
    { label_ru: '⚡ Шоковый жезл', label_en: '⚡ Shock Rod', desc_ru: 'Бьёт электрическим разрядом вплотную. +18 урон.', desc_en: 'Delivers electric discharge. +18 damage.', materials: 40, ammo: 0, unlock: 'shockrod', type: 'weapon' },
    { label_ru: '🔩 Вибро-кулак', label_en: '🔩 Vibro-Fist', desc_ru: 'Силовая перчатка с вибратором. +26 урон.', desc_en: 'Power glove with vibrations. +26 damage.', materials: 65, ammo: 0, unlock: 'vibrofist', type: 'weapon' },
    { label_ru: '💣 Гранатомет', label_en: '💣 Launcher', desc_ru: 'Самодельный. Огромный урон. +45 урон.', desc_en: 'Homemade. Huge damage. +45 damage.', materials: 80, ammo: 20, unlock: 'launcher', type: 'weapon' },
    { label_ru: '🔆 Лазерная пушка', label_en: '🔆 Laser Cannon', desc_ru: 'Демонтированный промышленный лазер. +55 урон.', desc_en: 'Dismantled industrial laser. +55 damage.', materials: 120, ammo: 30, unlock: 'laserc', type: 'weapon' },
    { label_ru: '🛡️ Лёгкая броня', label_en: '🛡️ Light Armor', desc_ru: 'Пластины из обломков. Экипировка.', desc_en: 'Plates from wreckage. Equipment.', materials: 25, ammo: 0, armorId: 'light', type: 'armor' },
    { label_ru: '🔰 Армейский броник', label_en: '🔰 Combat Armor', desc_ru: 'Надёжная защита. Экипировка.', desc_en: 'Reliable protection. Equipment.', materials: 60, ammo: 0, armorId: 'medium', type: 'armor' },
    { label_ru: '🤖 Силовой каркас', label_en: '🤖 Power Frame', desc_ru: 'Тяжёлая броня. Экипировка.', desc_en: 'Heavy armor. Equipment.', materials: 150, ammo: 50, armorId: 'heavy', type: 'armor' },
    { label_ru: '🧬 Усиленные стимы', label_en: '🧬 Reinforced Stims', desc_ru: 'Улучшает эффект аптечек. +15 к силе лечения.', desc_en: 'Improves medkit effects. +15 heal power.', materials: 40, ammo: 0, healBoost: 15, type: 'upgrade' }
  ];

  // === ФРАГМЕНТЫ ПАМЯТИ ЯНКОВСКОГО ===
  