export const WEAPON_STATS = {
    fists: { dmg: 4, cd: 0.2, name_ru: 'КУЛАКИ', name_en: 'FISTS', isGun: false },
    knife: { dmg: 8, cd: 0.25, name_ru: 'ЗАТОЧКА', name_en: 'SHANK', isGun: false },
    wrench: { dmg: 14, cd: 0.4, name_ru: 'ГВОЗДОДЕР', name_en: 'CROWBAR', isGun: false },
    pickaxe: { dmg: 24, cd: 0.5, name_ru: 'ЛОПАТА', name_en: 'SHOVEL', isGun: false },
    shockrod: { dmg: 35, cd: 0.6, name_ru: 'ШОКЕР', name_en: 'TASER', isGun: false },
    vibrofist: { dmg: 55, cd: 0.7, name_ru: 'КАСТЕТ', name_en: 'BRASS KNUCKLES', isGun: false },
    pistol: { dmg: 18, cd: 0.3, name_ru: 'РОГАТКА', name_en: 'SLINGSHOT', isGun: true },
    shotgun: { dmg: 35, cd: 0.7, name_ru: 'САМОПАЛ', name_en: 'HOMEMADE GUN', isGun: true },
    rifle: { dmg: 50, cd: 0.45, name_ru: 'ВОЗДУШКА', name_en: 'AIR RIFLE', isGun: true },
    plasma: { dmg: 80, cd: 0.8, name_ru: 'КОКТЕЙЛЬ МОЛОТОВА', name_en: 'MOLOTOV', isGun: true },
    launcher: { dmg: 120, cd: 1.3, name_ru: 'МЕШОК КИРПИЧЕЙ', name_en: 'BRICK BAG', isGun: true },
    laserc: { dmg: 150, cd: 1.0, name_ru: 'ФЕЙЕРВЕРК', name_en: 'FIREWORK', isGun: true }
  };

  export const ARMOR_STATS = {
    none: { name_ru: 'ЛОХМОТЬЯ', name_en: 'RAGS', hp: 0, armorClass: 0 },
    light: { name_ru: 'ВАТНИК', name_en: 'PADDED JACKET', hp: 25, armorClass: 0.1 },
    medium: { name_ru: 'КОЖАНКА', name_en: 'LEATHER JACKET', hp: 50, armorClass: 0.25 },
    heavy: { name_ru: 'ДЕЛОВОЙ КОСТЮМ', name_en: 'BUSINESS SUIT', hp: 150, armorClass: 0.45 }
  };

  export const SHOP_ITEMS = [
    { key: 'food', label_ru: '🍖 Бутерброд x5', label_en: '🍖 Sandwich x5', amount: 5, price: 20, type: 'resource' },
    { key: 'water', label_ru: '💧 Газировка x5', label_en: '💧 Soda x5', amount: 5, price: 30, type: 'resource' },
    { key: 'ammo', label_ru: '⚡ Бутылки x14', label_en: '⚡ Bottles x14', amount: 14, price: 15, type: 'resource' },
    { key: 'medkits', label_ru: '✚ Бинт x1', label_en: '✚ Bandage x1', amount: 1, price: 25, type: 'resource' },
    { key: 'weaponWrench', label_ru: '🔧 Гвоздодер', label_en: '🔧 Crowbar', price: 45, type: 'weapon', weaponId: 'wrench' },
    { key: 'weaponPistol', label_ru: '🔫 Рогатка', label_en: '🔫 Slingshot', price: 85, type: 'weapon', weaponId: 'pistol' },
    { key: 'weaponShotgun', label_ru: '💥 Самопал', label_en: '💥 Homemade Gun', price: 150, type: 'weapon', weaponId: 'shotgun' },
    { key: 'weaponRifle', label_ru: '🎯 Воздушка', label_en: '🎯 Air Rifle', price: 250, type: 'weapon', weaponId: 'rifle' },
    { key: 'weaponPlasma', label_ru: '⚛️ Коктейль Молотова', label_en: '⚛️ Molotov', price: 500, type: 'weapon', weaponId: 'plasma' },
    { key: 'armorLight', label_ru: '🛡️ Ватник', label_en: '🛡️ Padded Jacket', price: 100, type: 'armor', armorId: 'light' },
    { key: 'armorMedium', label_ru: '🔰 Кожанка', label_en: '🔰 Leather Jacket', price: 250, type: 'armor', armorId: 'medium' },
    { key: 'armorHeavy', label_ru: '🤖 Деловой костюм', label_en: '🤖 Business Suit', price: 600, type: 'armor', armorId: 'heavy' }
  ];

  export const CRAFT_ITEMS = [
    { label_ru: '🗡️ Заточка', label_en: '🗡️ Shank', desc_ru: 'Острая арматура. +3 урон.', desc_en: 'Sharp rebar. +3 damage.', materials: 8, ammo: 0, unlock: 'knife', type: 'weapon' },
    { label_ru: '⛏️ Лопата', label_en: '⛏️ Shovel', desc_ru: 'Тяжелый инструмент. +10 урон.', desc_en: 'Heavy tool. +10 damage.', materials: 20, ammo: 0, unlock: 'pickaxe', type: 'weapon' },
    { label_ru: '⚡ Шокер', label_en: '⚡ Taser', desc_ru: 'Бьет током. +18 урон.', desc_en: 'Zaps enemies. +18 damage.', materials: 40, ammo: 0, unlock: 'shockrod', type: 'weapon' },
    { label_ru: '🔩 Кастет', label_en: '🔩 Brass Knuckles', desc_ru: 'Для серьезных разговоров. +26 урон.', desc_en: 'For serious talks. +26 damage.', materials: 65, ammo: 0, unlock: 'vibrofist', type: 'weapon' },
    { label_ru: '💣 Мешок кирпичей', label_en: '💣 Brick Bag', desc_ru: 'Огромный урон по площади. +45 урон.', desc_en: 'Huge area damage. +45 damage.', materials: 80, ammo: 20, unlock: 'launcher', type: 'weapon' },
    { label_ru: '🔆 Фейерверк', label_en: '🔆 Firework', desc_ru: 'Ослепительно и больно. +55 урон.', desc_en: 'Dazzling and painful. +55 damage.', materials: 120, ammo: 30, unlock: 'laserc', type: 'weapon' },
    { label_ru: '🛡️ Ватник', label_en: '🛡️ Padded Jacket', desc_ru: 'Тепло и защита. Экипировка.', desc_en: 'Warm and protective. Gear.', materials: 25, ammo: 0, armorId: 'light', type: 'armor' },
    { label_ru: '🔰 Кожанка', label_en: '🔰 Leather Jacket', desc_ru: 'Стиль улиц. Экипировка.', desc_en: 'Street style. Gear.', materials: 60, ammo: 0, armorId: 'medium', type: 'armor' },
    { label_ru: '🤖 Деловой костюм', label_en: '🤖 Business Suit', desc_ru: 'Для высшего общества. Экипировка.', desc_en: 'For high society. Gear.', materials: 150, ammo: 50, armorId: 'heavy', type: 'armor' },
    { label_ru: '🧬 Живучесть', label_en: '🧬 Vitality', desc_ru: 'Закалка улиц. +15 к силе лечения.', desc_en: 'Street hardened. +15 heal power.', materials: 40, ammo: 0, healBoost: 15, type: 'upgrade' }
  ];