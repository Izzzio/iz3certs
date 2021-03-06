let DOCUMENTS_TYPES = {
    "0": "Диплом бакалавра",
    "1": "Диплом магистра",
    "2": "Диплом специалиста",
    "4": "Диплом о неполном высшем образовании",
    "5": "Аттестат об основном общем образовании",
    "6": "Аттестат о среднем (полном) общем образовании",
    "7": "Свидетельство об окончании специальной (коррекционной) общеобразовательной школы",
    "8": "Диплом государственного образца кандидата наук",
    "9": "Диплом государственного образца доктора наук",
    "10": "Аттестат государственного образца доцента по специальности",
    "11": "Аттестат государственного образца профессора по специальности",
    "12": "Удостоверение о краткосрочном повышении квалификации",
    "13": "Свидетельство о повышении квалификации",
    "14": "Диплом о профессиональной переподготовке",
    "15": "Диплом о начальном профессиональном образовании",
    "16": "Свидетельство об уровне квалификации",
    "17": "Диплом о среднем профессиональном образовании (базовый уровень)",
    "18": "Диплом о среднем профессиональном образовании (повышенный уровень)",
    "19": "Академическая справка",
    "20": "Свидетельство о результатах единого государственного экзамена",
    "21": "Зачетная книжка студента образовательного учреждения среднего профессионального образования",
    "22": "Диплом о дополнительном (к высшему) образовании",
    "23": "Свидетельство государственного образца об окончании специальной (коррекционной) общеобразовательной школы VIII вида",
    "24": "Свидетельство государственного образца об окончании специального (коррекционного) класса общеобразовательного учреждения",
    "25": "Сертификат об окончании бизнес акселератора Akselerator.ru",
    "26": "Диплом об окончании федеральной обучающей программы-конкурса \"Королевы бизнеса\""
};

let ISSUERS = {
    "0": "Блокчейн академия IZZZIO",
    "1": "Тестовое образовательное учреждение №1",
    "2": "Бизнес акселератор Akselerator.ru",
    "3": "Программа-конкурс \"Королевы бизнеса\": Кострома",
    "4": "Программа-конкурс \"Королевы бизнеса\": Киров",
    "5": "Программа-конкурс \"Королевы бизнеса\": Ярославль",
    "6": "Программа-конкурс \"Королевы бизнеса\": Иваново",
    "7": "Программа-конкурс \"Королевы бизнеса\": Рязань",
    "8": "Программа-конкурс \"Королевы бизнеса\": Нижний новгород",
};

let DOCUMENT_PROGRAM = {
    "0": "Сертификат об окончании блокчейн академии IZZZIO",
    "1": "56.00.00 Военное управление",
    "2": "56.04.01 Национальная безопасность и оборона государства",
    "3": "56.04.02 Управление воинскими частями и соединениями",
    "4": "56.04.03 Управление боевым обеспечением войск (сил)",
    "5": "56.04.04 Управление техническим обеспечением войск (сил)",
    "6": "56.04.05 Управление информационной безопасностью органов управления систем и комплексов военного назначения",
    "7": "56.04.06 Управление производством и развитием вооружения и военной техники",
    "8": "56.04.07 Управление использованием атомной энергии и обеспечением ядерной безопасности в области ядерных установок военного назначения",
    "9": "56.04.08 Управление тыловым обеспечением войск (сил)",
    "10": "56.04.09 Организация морально-психологического обеспечения",
    "11": "56.04.10 Управление финансовым обеспечением Вооруженных Сил Российской Федерации",
    "12": "56.04.11 Управление медицинским обеспечением войск (сил)",
    "13": "56.04.12 Военное и административное управление",
    "14": "57.00.00 Обеспечение государственной безопасности",
    "15": "57.04.01 Государственное управление в пограничной сфере",
    "17": "05.00.00 Науки о Земле",
    "18": "05.05.01 Метеорология специального назначения",
    "19": "05.05.02 Военная картография",
    "20": "09.00.00 Информатика и вычислительная техника",
    "21": "09.05.01 Применение и эксплуатация автоматизированных систем специального назначения",
    "22": "10.00.00 Информационная безопасность",
    "23": "10.05.06 Криптография",
    "24": "10.05.07 Противодействие техническим разведкам",
    "25": "11.00.00 Электроника, радиотехника и системы связи",
    "26": "11.05.03 Применение и эксплуатация средств и систем специального мониторинга",
    "27": "11.05.04 Инфокоммуникационные технологии и системы специальной связи",
    "28": "13.00.00 Электро- и теплоэнергетика",
    "29": "13.05.01 Тепло- и электрообеспечение специальных технических систем и объектов",
    "30": "13.05.02 Специальные электромеханические системы",
    "31": "14.00.00 Ядерная энергетика и технологии",
    "32": "14.05.04 Электроника и автоматика физических установок",
    "33": "15.05.02 Робототехника военного и специального назначения",
    "34": "17.00.00 Оружие и системы вооружения",
    "35": "17.05.04 Технологии веществ и материалов в вооружении и военной технике",
    "36": "27.00.00 Управление в технических системах",
    "37": "27.05.02 Метрологическое обеспечение вооружения и военной техники",
    "38": "56.00.00 Военное управление",
    "39": "56.05.01 Тыловое обеспечение",
    "40": "56.05.02 Радиационная, химическая и биологическая защита",
    "41": "56.05.03 Служебно-прикладная физическая подготовка",
    "42": "56.05.04 Управление персоналом (Вооруженные Силы РФ, другие войска, воинские формирования и приравненные к ним органы РФ)",
    "43": "56.05.05 Военная журналистика",
    "44": "56.05.06 Защита информации на объектах информатизации военного назначения",
    "45": "56.05.07 Строительство и эксплуатация зданий и сооружений военного и специального назначения",
    "46": "57.00.00 Обеспечение государственной безопасности",
    "47": "57.05.01 Пограничная деятельность",
    "48": "57.05.02 Государственная охрана",
    "49": "57.05.03 Технологическое обеспечение национальной безопасности и обороны",
    "51": "56.00.00 Военное управление",
    "52": "56.06.01 Военные науки",
    "54": "08.00.00 Техника и технологии строительства",
    "55": "08.07.01 Техника и технологии строительства",
    "56": "09.00.00 Информатика и вычислительная техника",
    "57": "09.07.01 Информатика и вычислительная техника",
    "58": "10.00.00 Информационная безопасность и противодействие техническим разведкам",
    "59": "10.07.01 Информационная безопасность",
    "60": "11.00.00 Электроника, радиотехника и системы связи",
    "61": "11.07.01 Электроника, радиотехника и системы связи",
    "62": "17.00.00 Оружие и системы вооружения",
    "63": "17.07.01 Оружие и системы вооружения",
    "64": "18.00.00 Химические технологии",
    "65": "18.07.01 Химическая технология",
    "66": "23.00.00 Техника и технологии наземного транспорта",
    "67": "23.07.01 Техника и технологии наземного транспорта",
    "68": "24.00.00 Авиационная и ракетно-космическая техника",
    "69": "24.07.01 Авиационная техника и технологии",
    "70": "24.07.02 Ракетно-космическая техника и технологии",
    "71": "26.00.00 Техника и технологии кораблестроения и водного транспорта",
    "72": "26.07.01 Техника и технологии кораблестроения и водного транспорта",
    "73": "37.00.00 Психологические науки",
    "74": "37.07.01 Психологические науки",
    "75": "38.00.00 Экономика и управление",
    "76": "38.07.01 Экономика",
    "77": "40.00.00 Юриспруденция",
    "78": "40.07.01 Юриспруденция",
    "79": "40.07.02 Правовое обеспечение государственной безопасности",
    "80": "44.00.00 Образование и педагогические науки",
    "81": "44.07.01 Образование и педагогические науки",
    "82": "46.00.00 Исторические науки и археология",
    "83": "46.07.01 Исторические науки и археология",
    "84": "56.00.00 Военное управление",
    "85": "56.07.01 Военные науки",
    "86": "57.00.00 Обеспечение государственной безопасности",
    "87": "57.07.01 Обеспечение государственной безопасности",
    "88": "Программа бизнес акселерации Akselerator.ru",
    "89": "Диплом об окончании федеральной обучающей программы-конкурса \"Королевы бизнеса\""
};
