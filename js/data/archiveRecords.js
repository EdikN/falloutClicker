// === СЕКРЕТНЫЕ ЗАПИСИ АРХИВА ===
// Открываются за Архивные ключи (§5.2.3): записи прошлых клонов, скрытые диалоги,
// реплики NPC. Тон — как у MEMORY_FRAGMENTS в story.js. Каждая стоит 1 ключ.
// Открытые хранятся в metaState.unlockedRecords = { id: true }.

export const ARCHIVE_RECORDS = [
  {
    id: 'rec_clone_01', cost: 1,
    title_ru: 'ЗАПИСЬ КЛОНА №14', title_en: 'CLONE №14 LOG',
    text_ru: '«Я насчитал тринадцать тел до себя. У всех — моё лицо. Я перестал верить, что я первый. Если ты читаешь это — ты тоже не первый. Не теряй время на самообман. Двигайся.»',
    text_en: '"I counted thirteen bodies before me. All with my face. I stopped believing I was the first. If you read this — you are not the first either. Don\'t waste time on self-deception. Move."'
  },
  {
    id: 'rec_director_memo', cost: 1,
    title_ru: 'СЛУЖЕБНАЯ ЗАПИСКА ДИРЕКТОРА', title_en: 'DIRECTOR\'S MEMO',
    text_ru: '«Объект 73 демонстрирует устойчивость к деградации памяти. Рекомендую не уничтожать ранние копии — пусть накапливают опыт между циклами. Это ускорит созревание финального экземпляра.»',
    text_en: '"Object 73 shows resistance to memory degradation. I recommend not destroying early copies — let them accumulate experience between cycles. This will accelerate the maturation of the final instance."'
  },
  {
    id: 'rec_amazon_doubt', cost: 1,
    title_ru: 'ПЕРЕХВАТ: АМАЗОНКА', title_en: 'INTERCEPT: AMAZON',
    text_ru: '«Директор, я снова ликвидировала его. Семьдесят третий раз. Скажите... он чувствует это? Каждый раз его глаза — как в первый. Может, мы убиваем не инструмент. Может, мы убиваем человека.»',
    text_en: '"Director, I liquidated him again. The seventy-third time. Tell me... does he feel it? Every time his eyes are like the first. Maybe we are not killing a tool. Maybe we are killing a person."'
  },
  {
    id: 'rec_gate_code', cost: 1,
    title_ru: 'ОБРЫВОК ШИФРА', title_en: 'CIPHER FRAGMENT',
    text_ru: '«...код от запечатанного отсека хранится не в системе. Он в тебе. В дате, которую ты не должен помнить. 17-04. Остальное — найди сам.»',
    text_en: '"...the code to the sealed compartment is not in the system. It is in you. In a date you should not remember. 17-04. Find the rest yourself."'
  },
  {
    id: 'rec_drifter_truth', cost: 1,
    title_ru: 'ИСПОВЕДЬ БРОДЯГИ', title_en: 'DRIFTER\'S CONFESSION',
    text_ru: '«Я помогаю тебе не из доброты. Я был тем, кто загружал твои копии в капсулы. Каждое твоё пробуждение — на моей совести. Дай мне искупить хоть одно из них.»',
    text_en: '"I help you not out of kindness. I was the one who loaded your copies into the pods. Every awakening of yours is on my conscience. Let me atone for at least one of them."'
  },
  {
    id: 'rec_final_protocol', cost: 1,
    title_ru: 'ПРОТОКОЛ «ВЕНЕЦ»', title_en: 'PROTOCOL "CROWN"',
    text_ru: '«Когда экземпляр переживёт сто циклов и сохранит человечность выше порога — он станет совершенным носителем. Тогда Директор займёт его тело. Бессмертие. Вот его настоящая цель. Не дай себе стать короной.»',
    text_en: '"When an instance survives a hundred cycles and keeps its humanity above the threshold — it becomes the perfect vessel. Then the Director will take its body. Immortality. That is his true goal. Do not let yourself become the crown."'
  }
];
