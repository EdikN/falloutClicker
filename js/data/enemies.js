export const ENEMIES = [
    { name_ru: 'Дикий робо-пес', name_en: 'Cyber-Dog', hp: 20, dmg: 4, atk: 2.5, img: 'img/enemy_cyber_dog.webp', icon: '🐕' },
    { name_ru: 'Бомж-конкурент', name_en: 'Rival Hobo', hp: 35, dmg: 6, atk: 3.0, img: 'img/person.webp', icon: '👊' },
    { name_ru: 'Сторожевой пес', name_en: 'Guard Dog', hp: 45, dmg: 5, atk: 2.2, img: 'img/enemy_cyber_dog.webp', icon: '🐕' },
    { name_ru: 'Прототип синта', name_en: 'Synth Prototype', hp: 55, dmg: 9, atk: 3.5, img: 'img/enemy_synth.webp', icon: '🤖' },
    { name_ru: 'Синт-отступник', name_en: 'Rebel Synth', hp: 70, dmg: 12, atk: 4.0, img: 'img/enemy_synth.webp', icon: '🤖' },
    { name_ru: 'Радиоактивный мутант', name_en: 'Toxic Mutant', hp: 85, dmg: 14, atk: 3.2, img: 'img/enemy_mutant.webp', icon: '☣️' },
    { name_ru: 'Служебный дрон', name_en: 'Security Drone', hp: 40, dmg: 8, atk: 3.8, armor: 0.1, img: 'img/enemy_drone.webp', icon: '🛸' },
    { name_ru: 'Токсичный пес', name_en: 'Toxic Hound', hp: 60, dmg: 15, atk: 4.5, img: 'img/enemy_toxic_ghoul.webp', icon: '🤢' },
    { name_ru: 'Патрульный дрон', name_en: 'Patrol Drone', hp: 90, dmg: 10, atk: 3.0, armor: 0.3, img: 'img/enemy_drone.webp', icon: '🛸' },
    { name_ru: 'Охотник за головами', name_en: 'Bounty Hunter', hp: 50, dmg: 18, atk: 3.5, img: 'img/enemy_hunter.webp', icon: '🕶️' },
    { name_ru: 'Канализационный пес', name_en: 'Sewer Hound', hp: 110, dmg: 6, atk: 4.8, img: 'img/enemy_toxic_ghoul.webp', icon: '🤢' }
  ];

  export const ELITE_ENEMIES = [
    { name_ru: 'ОМОНовец-ликвидатор', name_en: 'Riot Liquidator', hp: 130, dmg: 18, atk: 3.8, armor: 0.2, img: 'img/enemy_liquidator.webp', icon: '🛡️' },
    { name_ru: 'Тяжелый робо-мех', name_en: 'Heavy Combat Mech', hp: 180, dmg: 22, atk: 5.0, armor: 0.4, img: 'img/enemy_mech.webp', icon: '🤖' },
    { name_ru: 'Кибер-телохранитель', name_en: 'Cyber Bodyguard', hp: 250, dmg: 25, atk: 4.5, armor: 0.3, img: 'img/enemy_ares.webp', icon: '👔' },
    { name_ru: 'Ликвидатор долгов', name_en: 'Cyber Executioner', hp: 160, dmg: 20, atk: 3.5, armor: 0.25, img: 'img/enemy_executioner.webp', icon: '💼' }
  ];

  export const STORY_ENEMIES = {
    thug: { name_ru: 'Сержант Петренко', name_en: 'Sergeant Petrenko', hp: 100, dmg: 10, baseDmg: 10, atk: 3.5, armor: 0.1, img: 'img/char_petrenko.webp', icon: '👮' },
    queen: { name_ru: 'Королева улиц', name_en: 'Street Queen', hp: 250, dmg: 20, baseDmg: 20, atk: 2.5, armor: 0.2, img: 'img/char_gang_leader.webp', icon: '👑' },
    boss_mayor: { name_ru: 'Мэр Артёмов (БОСС)', name_en: 'Mayor Artyomov (BOSS)', hp: 600, dmg: 35, baseDmg: 35, atk: 2.2, armor: 0.45, img: 'img/char_mayor.webp', icon: '🏗️' },
    security: { name_ru: 'Личная охрана Мэра', name_en: 'Mayor\'s Security', hp: 150, dmg: 14, baseDmg: 14, atk: 3.0, armor: 0.2, img: 'img/char_guard.webp', icon: '🕶️' },
    assassin: { name_ru: 'Наемный убийца', name_en: 'Assassin', hp: 120, dmg: 22, baseDmg: 22, atk: 2.0, armor: 0.1, img: 'img/char_shark.webp', icon: '🗡️' },
    riot_squad: { name_ru: 'Отряд ОМОН', name_en: 'Riot Squad', hp: 200, dmg: 16, baseDmg: 16, atk: 4.0, armor: 0.3, img: 'img/char_guard.webp', icon: '🛡️' },
    guard_dog: { name_ru: 'Служебный пес', name_en: 'Guard Dog', hp: 80, dmg: 16, baseDmg: 16, atk: 2.5, img: 'img/enemy_cyber_dog.webp', icon: '🐕' },
    drifter_enemy: { name_ru: 'Дикая кибер-собака', name_en: 'Feral Cyber-Dog', hp: 60, dmg: 8, baseDmg: 8, atk: 2.5, img: 'img/enemy_cyber_dog.webp', icon: '🐕' }
  };