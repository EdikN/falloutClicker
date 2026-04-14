export const LOCATIONS = [
    { name_ru: 'Склад запчастей', name_en: 'Part Depot', icon: '⚙️', desc_ru: 'Старые стеллажи с полезными компонентами.', desc_en: 'Old shelves with useful components.', reward: { materials: 8, caps: 6 }, danger: 0.2 },
    { name_ru: 'Медблок', name_en: 'Medbay', icon: '✚', desc_ru: 'Разбитые капсулы, но что-то ещё осталось.', desc_en: 'Broken pods, but something remains.', reward: { medkits: 1 }, danger: 0.3 },
    { name_ru: 'Оружейная', name_en: 'Armory', icon: '⚡', desc_ru: 'Запертые ящики с боеприпасами.', desc_en: 'Locked crates with ammunition.', reward: { ammo: 10, caps: 12 }, danger: 0.45 },
    { name_ru: 'Столовая', name_en: 'Mess Hall', icon: '🍖', desc_ru: 'Остатки сухпайков и фильтрованная вода.', desc_en: 'Leftover rations and filtered water.', reward: { food: 1, water: 1 }, danger: 0.15 },
    { name_ru: 'Лаборатория', name_en: 'Laboratory', icon: '🔬', desc_ru: 'Исследовательский отсек. Богатая находка.', desc_en: 'Research wing. A valuable find.', reward: { materials: 12, caps: 15 }, danger: 0.5 },
    { name_ru: 'Сектор 4 — Капсульный зал', name_en: 'Sector 4 — Pod Room', icon: '💀', desc_ru: 'Ряды капсул с телами, похожими на вас. Здесь жили и умирали клоны.', desc_en: 'Rows of pods with bodies like yours. Where clones lived and died.', reward: { materials: 20, caps: 5 }, danger: 0.3, storyFlag: 'sector4Unlocked', moodCost: 15 },
    { name_ru: 'Архив Иерихона', name_en: 'Jericho Archive', icon: '📁', desc_ru: 'Центральный компьютер. Файлы Директора. Здесь — всё.', desc_en: 'Central computer. Director\'s files. Everything is here.', reward: { materials: 10, caps: 25 }, danger: 0.6, storyFlag: 'archiveUnlocked' },
    { name_ru: 'Изолированный отсек', name_en: 'Isolated Wing', icon: '👁️', desc_ru: 'Крики стихают, когда вы подходите ближе. Дефектные клоны просят об эвтаназии.', desc_en: 'Screams fade as you approach. Faulty clones beg for euthanasia.', reward: { ammo: 5, materials: 15 }, danger: 0.5, moodCost: 25 },
    { name_ru: 'Старый медблок', name_en: 'Old Medbay', icon: '🩸', desc_ru: 'Стены в пятнах крови. Здесь проводились первые попытки переноса сознания.', desc_en: 'Blood-stained walls. Early attempts at consciousness transfer.', reward: { medkits: 2, caps: 8 }, danger: 0.45, moodCost: 10 }
  ];

  