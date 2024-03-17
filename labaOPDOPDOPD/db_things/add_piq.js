const mysql = require("mysql2");

const connection = mysql.createConnection({
    port: "1337",
    host: "localhost",
    user: "root",
    password: "1234"
});

connection.connect(function (err){
    if (err) throw err;
    const use_db = "USE opdopdopd";
    const add_piq = "INSERT INTO `piq` (`name`, `category_id`) VALUES ('Готовность к защите Родины с оружием в руках ', 1), ('Военно-профессиональная направленность', 1), ('Прямые внутренние мотивы военно-профессиональной деятельности', 1), ('Стремление к профессиональному совершенству', 1), ('Адекватная самооценка', 2), ('Самостоятельность', 2), ('Пунктуальность, педантичность', 2), ('Дисциплинированность', 2), ('Аккуратность в работе', 2), ('Организованность, самодисциплина', 2), ('Старательность, исполнительность', 2), ('Ответственность', 2), ('Трудолюбие', 2), ('Инициативность', 2), ('Самокритичность', 2), ('Оптимизм, доминирование положительных эмоций', 2), ('Самообладание, эмоциональная уравновешенность, выдержка', 2), ('Самоконтроль, способность к самонаблюдению', 2), ('Предусмотрительность', 2), ('Фрустрационная толерантность (отсутствие агрессивности или депрессивности в ситуациях неудач)', 2), ('Самомобилизующийся тип реакции на препятствия, возникающие на пути к достижению цели', 2), ('Интернальность (погруженность в себя, самодостаточность, необщительность)', 2), ('Экстернальность (ориентация на взаимодействие с людьми, общительность)', 2), ('Интрапунитивность (ориентация на собственные силы, уверенность в себе, чувство самоэффективности)', 2), ('Экстрапунитивность (ориентация на помощь других людей, надежда на благоприятные обстоятельства, неуверенность в себе)', 2), ('Способность планировать свою деятельность во времени', 2), ('Способность организовывать свою деятельность в условиях большого потока информации и разнообразия поставленных задач', 2), ('Способность брать на себя ответственность за принимаемые решения и действия', 2), ('Способность принимать решение в нестандартных ситуациях', 2), ('Способность рационально действовать в экстремальных ситуациях', 2), ('Способность эффективно действовать (также быстро принимать решения) в условиях дефицита времени', 2), ('Способность переносить неприятные ощущения (дурной запах, шум, грязь, холодная вода, ожог, царапина, удар электрического тока и т.д.) без потрясений', 2), ('Способность аргументировано отстаивать свое мнение', 2), ('Способность к переключениям с одной деятельности на другую', 2), ('Способность преодолевать страх', 2), ('Решительность', 3), ('Сильная воля', 3), ('Смелость', 3), ('Чувство долга', 3), ('Честность', 3), ('Порядочность', 3), ('Товарищество', 3), ('Зрительная оценка размеров предметов', 4), ('Зрительное восприятие расстояний между предметами', 4), ('Глазомер: линейный, угловой, объемный', 4), ('Глазомер динамический (способность оценивать направление и скорость движения предмета)', 4), ('Способность к различению фигуры (предмета, отметки, сигнала и пр.) на малоконтрастном фоне', 4), ('Способность различать и опознавать замаскированные объекты', 4), ('Способность к восприятию пространственного соотношения предметов', 4), ('Точность и оценка направления на источник звука', 4), ('Способность узнавать и различать ритмы', 4), ('Речевой слух (восприятие устной речи)', 4), ('Различение отрезков времени', 4), ('Способность к распознаванию небольших отклонений параметров технологических процессов от заданных значений по визуальным признакам', 4), ('Способность к распознаванию небольших отклонений параметров технологических процессов от заданных значений по акустическим признакам', 4), ('Способность к распознаванию небольших отклонений параметров технологических процессов от заданных значений по кинестетическим признакам', 4), ('Способность к зрительным представлениям', 5), ('Способность к пространственному воображению', 5), ('Способность к образному представлению предметов, процессов и явлений', 5), ('Способность наглядно представлять себе новое явление, ранее, не встречающееся в опыте, или старое, но в новых условиях', 5), ('Способность к переводу образа в словесное описание', 5), ('Способность к воссозданию образа по словесному описанию', 5), ('Аналитичность (способность выделять отдельные элементы действительности, способность к классификации)', 6), ('Синтетичность (способность к обобщениям, установлению связей, закономерностей, формирование понятий)', 6), ('Транссонантность (способность к актуализации и вовлечению в процесс мышления информации, хранящейся в памяти, ассоциативность мышления)', 6), ('Логичность', 6), ('Креативность (способность порождать необычные идеи, отклоняться от традиционных схем мышления)', 6), ('Оперативность (скорость мыслительных процессов, интеллектуальная лабильность)', 6), ('Предметность (объекты реального мира и их признаки)', 6), ('Образность (наглядные образы, схемы, планы и т.д.)', 6), ('Абстрактность (абстрактные образы, понятия)', 6), ('Вербальность (устная и письменная речь)', 6), ('Калькулятивность (цифровой материал)', 6), ('на лица', 7), ('на образы предметного мира', 7), ('на условные обозначения (знаки, символы, планы, схемы, графики)', 7), ('на цифры, даты', 7), ('на слова и фразы', 7), ('на семантику текста', 7), ('на лица', 8), ('на образы предметного мира', 8), ('на условные обозначения (знаки, символы, планы, схемы, графики)', 8), ('на цифры,  даты', 8), ('на слова и фразы', 8), ('на семантику текста', 8), ('на голоса', 9), ('на цифры', 9), ('на условные сигналы', 9), ('на мелодии', 9), ('на семантику сообщений', 9), ('на цифры', 10), ('на семантику сообщений', 10), ('на простые движения', 11), ('на сложные движения', 11), ('на положение и перемещение тела в пространстве', 11), ('Тактильная память', 11), ('Обонятельная память', 11), ('Вкусовая память', 11), ('Энергичность, витальность (активность)', 12), ('Умственная работоспособность', 12), ('Физическая работоспособность (выносливость)', 12), ('Нервно-эмоциональная устойчивость, выносливость по отношению к эмоциональным нагрузкам', 12), ('Острота зрения', 13), ('Адаптация зрения к темноте, свету', 13), ('Контрастная чувствительность монохроматического зрения', 13), ('Цветовая дифференциальная чувствительность', 13), ('Устойчивость зрительной чувствительности во времени', 13), ('Острота слуха', 13), ('Контрастная чувствительность слуха', 13), ('Слуховая дифференциальная чувствительность (способность различать: тембр, длительность, высоту, силу звука, ритм, фоновые или разнообразные шумы)', 13), ('Переносимость длительно действующего звукового раздражителя', 13), ('Чувствительность (осязание) пальцев', 13), ('Вибрационная чувствительность', 13), ('Мышечно-суставная чувствительность усилий или сопротивления', 13), ('Ощущение равновесия', 13), ('Ощущение ускорения', 13), ('Обонятельная чувствительность', 13), ('Способность узнавать и различать вкусовые ощущения', 13), ('Объем внимания (количество объектов, на которые может быть направлено внимание при их одновременном восприятии)', 13), ('Концентрированность внимания', 13), ('Устойчивость внимания во времени', 13), ('Переключаемость внимания (способность быстрого переключения внимания с одного объекта на другой или с одной деятельности на другую)', 13), ('Способность к распределению внимания между несколькими объектами или видами деятельности', 13), ('Помехоустойчивость внимания', 13), ('Способность подмечать изменения в окружающей обстановке, не сосредотачивая сознательно на них внимание', 13), ('Умение подмечать незначительные (малозаметные) изменения в исследуемом объекте, в показаниях приборов', 13), ('Способность реагировать на неожиданный зрительный сигнал посредством определённых движений', 13), ('Способность реагировать на неожиданный слуховой сигнал посредством определённых движений', 13), ('Согласованность движений с процессами восприятия (сложноорганизованная деятельность)', 13), ('Способность к сенсомоторному слежению за движущимся объекто', 13), ('Способность к выполнению мелких точных движений' ,13), ('Способность к выполнению сложных двигательных действий (актов)', 13), ('Способность к выполнению плавных соразмерных движений', 13), ('Координация движений ведущей руки', 13), ('Координация движений обеих рук', 13), ('Координация движений рук и ног', 13), ('Координация работы кистей рук и пальцев', 13), ('Твердость руки, устойчивость кистей рук (низкий тремор)', 13), ('Умение быстро записывать', 13), ('Красивый почерк', 13), ('Физическая сила', 13), ('Способность к быстрой выработке сенсомоторных навыков', 13), ('Способность к быстрой перестройке сенсомоторных навыков', 13), ('Пластичность и выразительность движений', 13), ('Отсутствие дефектов речи, хорошая дикция', 13), ('Способность речевого аппарата к интенсивной и длительной работе', 13), ('Способность к изменению тембра', 13), ('Способность к изменению силы звучания', 13), ('Переносимость динамических физических нагрузок', 14), ('Переносимость статических физических нагрузок', 14), ('Быстрый переход из состояния покоя к интенсивной работе', 14), ('Сохранение работоспособности при недостатке сна', 14), ('Сохранение работоспособности при развивающемся утомлени', 14), ('Сохранение бдительности в условиях однообразной деятельности (монотонии)', 14), ('Сохранение бдительности в режиме ожидания', 14), ('Сохранение работоспособности в некомфортных температурных условиях', 14), ('Сохранение работоспособности в условиях знакопеременных перегрузок (в том числе укачивания)', 14), ('Сохранение работоспособности в условиях воздействия вибрации', 14), ('Сохранение работоспособности в условиях воздействия разнонаправленных перегрузок ', 14), ('Сохранение работоспособности в условиях гипо(гипер) барометрических колебаний', 14), ('Сохранение работоспособности в условиях пониженного парциального давления кислорода ', 14), ('Сохранение работоспособности в условиях пониженного парциального давления углекислого газа', 14), ('Сохранение работоспособности в условиях ограничения возможностей удовлетворения базовых жизненных потребностей (голод, жажда, отдых, сексуальная потребность)', 14), ('Сохранение работоспособности в разных природно-климатических условиях', 14), ('Способность переадаптироваться к новым средовым условиям', 14), ('Антропометрические характеристики (в соответствии с требованиями профессии)', 15), ('Особенности телосложения (в соответствии с требованиями профессии)', 15), ('Хорошее общее физическое развитие – выносливость, координированность, сила, быстрота', 15), ('Физическая подготовленность к воздействию неблагоприятных факторов профессиональной деятельности', 15)";
    console.log("Connected!");
    connection.query(use_db, function (err){
        if (err) throw err;
        console.log("DB is in use!");
    });
    connection.query(add_piq, function (err){
        if (err) throw err;
        console.log("Professional important qualities inserted!");
    });
});
