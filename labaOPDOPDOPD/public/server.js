const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require("mysql2");
const {resolve} = require("path");

//const host = "::"||process.env.IP||"fd00::5:7e7b";
const app = express();
const PORT = "1488";
const PORT2 = "5252";

const connection = mysql.createConnection(
    {
        // port: "1337",
        host: "localhost",
        user: "root",
        password: "qwerty0987654321",
        database: "opdopdopd"
    }
);

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL database!");
    createTables();
});

function createTables() {
    connection.query("CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT, login VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, avatar VARCHAR(255), permissions INT CHECK (permissions = 2 or permissions = 1 OR permissions = 0) NOT NULL, PRIMARY KEY (id))", function (err) {
        if (err) throw err;
        console.log("Table users created!");
    });

    connection.query("CREATE TABLE IF NOT EXISTS professions(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))", function (err) {
        if (err) throw err;
        console.log("Table professions created!");
    });

    connection.query("CREATE TABLE IF NOT EXISTS categories(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))", function (err) {
        if (err) throw err;
        console.log("Table categories created!");
    });

    connection.query("CREATE TABLE IF NOT EXISTS piq(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, category_id INT NOT NULL, FOREIGN KEY fk_category_id (category_id) REFERENCES categories(id), PRIMARY KEY (id))", function (err) {
        if (err) throw err;
        console.log("Table PIQ created!");
    });

    connection.query("CREATE TABLE IF NOT EXISTS opinions(user_id INT NOT NULL, piq_id INT NOT NULL, profession_id INT NOT NULL, position INT CHECK (position > 0), FOREIGN KEY fk_user_id (user_id) REFERENCES users(id), FOREIGN KEY fk_piq_id (piq_id) REFERENCES piq(id), FOREIGN KEY fk_profession_id (profession_id) REFERENCES professions(id))", function (err) {
        if (err) throw err;
        console.log("Table opinions created!");
    });
}

app.use('/pictures', express.static(path.join(__dirname, 'public', 'pictures')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

function registration(connection, user_login, user_password, data) {
    jsonData = data;
    user_login = jsonData.login.toString();
    user_password = jsonData.password.toString();
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT login FROM users", function (err, result, fields) { //запрашиваем все логины
            if (err) throw err;
            let flag = true;
            for (let log in result) { //проверяем нет ли юзера с таким логином
                if (log.login === user_login) {
                    flag = false;
                }
            }
            if (!(flag)) { //если есть - шлём нахуй, хотя надо попросить придумать другой логин
                console.log("User already exist!");
            } else { //если нет - делаем новую запись в бд и все круто классно
                connection.query(`INSERT INTO users (login, password, permissions, name)
                                  VALUES ('${user_login}', '${user_password}', 0, 'user')`, function (result) {
                    console.log("Registration success!");
                });
            }
        });
    });
}

function calculateStandardDeviation(arr) {
    const n = arr.length;
    const avg = arr.reduce((acc, cur) => acc + parseFloat(cur), 0) / n;
    let sum = 0;
    for (let number in arr){
        sum += Math.pow(number - avg, 2);
    }
    return Math.sqrt(sum / (n - 1));
}

function authorisation(connection, user_login, user_password) {
    let message; //итоговое сообщение
    let result = false; //результат авторизации
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT login, password FROM users", function (err, result, fields) { //выбираем из бд логины и пароли
            if (err) throw err;
            let logs_and_pass = result; //получаем массив объектов
            let flag = false;
            let login;
            let password;
            for (let log of logs_and_pass) { //проверяем есть ли вообще такой логин
                if (log.login === user_login) {
                    flag = true;
                    login = log.login;
                    password = log.password;
                    break;
                }
            }
            if (!(flag)) { //Если нет такого логина - шлем нахуй
                message = "No such user!";
                result = false;
                console.log(message);
                return result;
            } else {
                if (user_password === password) { //если есть и пароль совпадает - все заебись
                    message = "Authorisation successful!";
                    connection.query("SELECT permissions FROM users WHERE login = " + mysql.escape(login) + " UNION SELECT id FROM users", function (err, res, fields) {
                        if (err) throw err;
                        usertype = res[0].permissions;
                        console.log(usertype);
                    })
                    result = true;
                    console.log(message);
                    return result;
                } else { //если не совпадает пароль - тоже шлем нахуй, хотя надо бы еще раз пароль запросить
                    message = "Wrong password!";
                    result = false;
                    console.log(message);
                    return result;
                }
            }
        });
    });
}

function add_piq_opinion(connection, piq, user_login, profession_name, position) {
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT id FROM piq WHERE name = " + mysql.escape(piq) + " UNION SELECT id FROM users WHERE login = " + mysql.escape(user_login) + " UNION SELECT id FROM professions WHERE name = " + mysql.escape(profession_name), function (err, result, fields) {
            //Находим айдишники ПВК, юзера и профессии
            if (err) throw err;
            let piq_id;
            let user_id;
            let profession_id;
            let counter = 0;
            for (let id in result) {
                if (counter === 0) {
                    piq_id = id.id;
                } else if (counter === 1) {
                    user_id = id.id;
                } else {
                    profession_id = id.id;
                }
            }
            connection.query("SELECT position FROM opinions WHERE piq_id = " + mysql.escape(piq_id) + " AND user_id = " + mysql.escape(user_id) + " AND profession_id = " + mysql.escape(profession_id), function (err, result, fields) {
                //Проверяем нет ли уже такого мнения у данного пользователя по данной профессии с данным ПВК
                if (result === []) { //если такого мнения еще нет, добавляем новое
                    connection.query("INSERT INTO opinions (user_id, piq_id, profession_id, position) VALUES (" + mysql.escape(user_id) + ", " + mysql.escape(piq_id) + ", " + mysql.escape(profession_id) + ", " + mysql.escape(position), function (err) {
                        if (err) throw err;
                        console.log("Opinion inserted!");
                    });
                } else { //если есть, то обновляем позицию
                    connection.query("UPDATE opinions SET position = " + mysql.escape(position) + " WHERE piq_id = " + mysql.escape(piq_id) + " AND user_id = " + mysql.escape(user_id) + " AND profession_id = " + mysql.escape(profession_id), function (err) {
                        if (err) throw err;
                        console.log("Opinion updated!");
                    })
                }
            });
        });
    });
}


app.use('/pictures', express.static(path.join(__dirname, 'public', 'pictures')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'OPDOPDOPD.html');
    res.sendFile(htmlFilePath);
});
app.get('/scripts.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/scripts.js');
});
app.get('/styling.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/styling.css');
});
app.get('/professionCSS.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/professionCSS.css');
});
app.get('/script_test1.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test1.js');
});
app.get('/script_test2.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test2.js');
});
app.get('/script_test3.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test3.js');
});
app.get('/script_test4.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test4.js');
});
app.get('/script_test5.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test5.js');
});
app.get('/script_test6.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test6.js');
});
app.get('/script_test7.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test7.js');
});
app.get('/GameDesigner.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'GameDesigner.html');
    res.sendFile(htmlFilePath);
});
app.get('/SysAdmin.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'SysAdmin.html');
    res.sendFile(htmlFilePath);
});
app.get('/SysAnal.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'SysAnal.html');
    res.sendFile(htmlFilePath);
});
app.get('/OPDOPDOPD.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'OPDOPDOPD.html');
    res.sendFile(htmlFilePath)
});
app.get('/sidepanel.css', (req, res) => {
    res.setHeader("Content-Type", "text/css"); // Use setHeader instead of header
    res.sendFile(__dirname + '/sidepanel.css');
});
app.get('/popug.jpg', (req, res) => {
    res.sendFile(__dirname + '/popug.jpg');
});
app.get('/profile.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'profile.html');
    res.sendFile(htmlFilePath);
});
app.get('/profileCSS.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/profileCSS.css');
});

app.get('/test1.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test1.html');
    res.sendFile(htmlFilePath);
});
app.get('/test2.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test2.html');
    res.sendFile(htmlFilePath);
});
app.get('/style_test.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/style_test.css');
});
app.get('/profiles.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/profiles.html');
    res.sendFile(htmlFilePath);
})
app.get('/testPage.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/testPage.html');
    res.sendFile(htmlFilePath);
});
app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/pictures' + '/icons' + '/favicon.ico');
});
app.get('/apple-touch-icon.png', (req, res) => {
    res.sendFile(__dirname + '/apple-touch-icon.png');
});
app.get('/testPage.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/testPage.css');
});
// app.get('/Kivisdenchyk.jpg', (req, res) => {
//     res.sendFile(path.join(__dirname, 'Kivisdenchyk.jpg'));
// });
app.get('/1.png', (req, res) => {
    res.sendFile(__dirname + '/1.png');
});
app.get('/2.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/2.png'));
});
app.get('/3.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/3.png'));
});
app.get('/4.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/4.png'));
});
app.get('/5.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/5.png'));
});
app.get('/6.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/6.png'));
});
app.get('/sleep.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/sleep.png'));
});
app.get('/test3.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test3.html');
    res.sendFile(htmlFilePath);
});
app.get('/test4.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test4.html');
    res.sendFile(htmlFilePath);
});
app.get('/test5.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test5.html');
    res.sendFile(htmlFilePath);
});
app.get('/sound.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sound.mp3'));
});
app.get('/sounds/1.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/1.mp3'));
});
app.get('/sounds/2.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/2.mp3'));
});
app.get('/sounds/3.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/3.mp3'));
});
app.get('/sounds/4.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/4.mp3'));
});
app.get('/sounds/5.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/5.mp3'));
});
app.get('/sounds/6.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/6.mp3'));
});
app.get('/sounds/7.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/7.mp3'));
});
app.get('/sounds/8.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/8.mp3'));
});
app.get('/sounds/9.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/9.mp3'));
});
app.get('/sounds/10.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/10.mp3'));
});

app.get('/test6.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test6.html');
    res.sendFile(htmlFilePath);
});

app.get('/test7.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test7.html');
    res.sendFile(htmlFilePath);
});

app.post('/tes1res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const results = jsonData.res;
    const test_id = 1;
    const sum = results.reduce((acc, cur) => acc + parseFloat(cur), 0);
    const avg = sum / results.length;
    const deviation = calculateStandardDeviation(results);
    connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?);", [user_name, test_id, 0, avg, 0, deviation], function(err, result){
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }
        console.log("Test attempt added to db");
    });
});

app.post('/tes2res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const results = jsonData.res;
    const test_id = 2;
    const sum = results.reduce((acc, cur) => acc + parseFloat(cur), 0);
    const avg = sum / results.length;
    const deviation = calculateStandardDeviation(results);
    connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?);", [user_name, test_id, 0, avg, 0, deviation], function(err, result){
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }
        console.log("Test attempt added to db");
    });
});

app.post('/tes3res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 3;
    console.log(jsonData);
    const number_of_mistakes = result[0];
    const results = result.slice(1);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(result);
    connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?);", [user_name, test_id, 0, avg, 0, deviation, number_of_mistakes], function(err, result){
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }
        console.log("Test attempt added to db");
    });
});

app.post('/tes4res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 4;
    console.log(jsonData);
    const number_of_mistakes = result[0];
    const results = result.slice(1);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(result);
    connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?);", [user_name, test_id, 0, avg, 0, deviation, number_of_mistakes], function(err, result){
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }
        console.log("Test attempt added to db");
    });
});

app.post('/tes5res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    console.log(jsonData);
    const test_id = 5;
    const number_of_mistakes = result[0];
    const results = result.slice(1);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(result);
    connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?);", [user_name, test_id, 0, avg, 0, deviation, number_of_mistakes], function(err, result){
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }
        console.log("Test attempt added to db");
    });
});

app.post('/tes6res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 6;
    const avg = result.reduce((acc, cur) => acc + parseFloat(cur), 0) / result.length;
    const deviation = calculateStandardDeviation(result);
    connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?);", [user_name, test_id, 0, avg, 0, deviation], function(err, result){
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }
        console.log("Test attempt added to db");
    });
})

app.post('/tes7res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    console.log(jsonData);
    const test_id = 7;
    const number_of_mistakes = result[0];
    const results = result.slice(1);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(result);
    connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?);", [user_name, test_id, 0, avg, 0, deviation, number_of_mistakes], function(err, result){
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }
        console.log("Test attempt added to db");
    });
})

app.use(bodyParser.json());
app.post('/endpoint', (req, res) => {
    const jsonData = req.body;
    const login = jsonData.login ? jsonData.login.toString() : null;
    const password = jsonData.password ? jsonData.password.toString() : null;

    if (!login || !password) {
        return res.status(400).json({error: 'Отсутствуют данные для аутентификации'});
    }

    let username = "";
    let permissions = "";
    let avatar = "";
    let test_attempts = [];
    let piq_opinions = [];
    let status = "";

    if (jsonData.window === 'registration') {
        registration(connection, login, password, jsonData);
        status = 'success';
        permissions = '0';
        app.use(express.static(path.join(__dirname, 'public')));
        return res.json({
            login: login,
            status: status,
            username: username,
            permissions: permissions,
            avatar: avatar,
            test_attempts: test_attempts,
            piq_opinions: piq_opinions
        });
    }

    connection.query("SELECT * FROM users WHERE login = ? AND password = ?", [login, password], function (err, result) {
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }

        if (result.length === 0) {
            status = "error";
            return res.json({
                login: login,
                status: status,
                username: username,
                permissions: permissions,
                avatar: avatar,
                test_attempts: test_attempts,
                piq_opinions: piq_opinions
            });
        }

        status = "success";
        username = result[0].name.toString();
        permissions = result[0].permissions.toString();
        avatar = result[0].avatar.toString();
        const user_id = result[0].id;

        connection.query("SELECT test.name, test_attempt.average_value, test_attempt.number_of_passes, test_attempt.number_of_mistakes, test_attempt.stadart_deviation FROM test_attempt INNER JOIN test ON test_attempt.test_id = test.id WHERE test_attempt.user_id = ?", [user_id], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }

            connection.query("SELECT professions.name, piq.name, opinions.position FROM opinions JOIN professions ON professions.id = opinions.profession_id JOIN piq ON piq.id = opinions.piq_id WHERE user_id = ?", [user_id], function (err, result) {
                if (err) {
                    console.error('Ошибка выполнения запроса к базе данных:', err);
                    return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
                }

                result.forEach(res => {
                    piq_opinions.push([res.professions.name.toString(), res.piq.name.toString(), res.position.toString()]);
                });

                res.json({
                    login: login,
                    status: status,
                    username: username,
                    permissions: permissions,
                    avatar: avatar,
                    test_attempts: test_attempts,
                    piq_opinions: piq_opinions
                });
            });
        });

    });
});
app.get('/users', async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connection.query("SELECT login, avatar, permissions, name FROM users", function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });

        const usersJsons = users.map(user => (
            {
                login: user.login,
                avatar: user.avatar == null ? "/default.jpg" : user.avatar.toString(),
                permission: user.permissions,
                username: user.name !== 'user' ? user.name : user.login.split('@')[0]
            }));

        usersJsons.forEach(user => {
            const name = user.username;
            app.get(`/${name}`, (req, res) => {
                const htmlFilePath = path.join(__dirname, 'profile.html');
                res.sendFile(htmlFilePath);
            });
        });

        res.json(usersJsons);
    } catch (error) {
        console.error('Ошибка при получении данных о пользователях:', error);
        res.status(500).json({error: 'Ошибка при получении данных о пользователях'});
    }
});
app.post('/avatars', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    let avatar = jsonData.avatar;
    app.get(`${avatar}`, (req, res) => {
        res.sendFile(path.join(__dirname, '/pictures', `${avatar}`));
    });
    res.sendFile(path.join(__dirname, '/pictures', `${avatar}`));
});
app.get('/myStat', (req, res) => {
    const name = req.query.username;
    const testNum = req.query.testNum;

    connection.query("SELECT id FROM users WHERE name = ?", [name], function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).send('User not found');
        }
        const user_id = result[0].id;

        connection.query("SELECT test_attempt.average_value FROM test_attempt WHERE test_attempt.user_id = ? AND test_attempt.test_id = ?", [user_id, testNum], function (err, result) {
            if (err) throw err;
            res.json(result.map(row => row.average_value));
        });
    });
});

app.post('/pvkpoint', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    const user_name = jsonData.name;
    const profession_id = jsonData.prof;
    const order = jsonData.order;
    for (let i = 0; i < order.length; i++) {
        //ВОТ ТУТ ВОПРОСЫ
        connection.query("SELECT id FROM piq WHERE name = ?",[order.id], function (err, result) {
            //ВОПРОСЫ ВОТ ТУТ
            if (err) throw err;
            piqId = result[0];
            connection.query("INSERT INTO opinions (user_id, piq_id, profession_id, position) VALUES ((SELECT id FROM user WHERE name = ?), ?, ?, ?)", [user_name, piqId, profession_id, i], function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            })
        })
    }
    console.log(array);
});

app.listen(PORT2, () => {
    console.log("Сервер запущен на порту " + PORT2);
});

