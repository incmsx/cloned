const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "opdopdopd"
});

//функция регистрации
export function registration(connection, login, password){
    connection.connect(function (err){
        console.log("БД успешно подняты!");
        if (err) throw err;
        connection.query("SELECT login FROM users", function (err, result, fields){ //запрашиваем все логины
            if (err) throw err;
            let flag = true;
            for (let log in result){ //проверяем нет ли юзера с таким логином
                if (log.login === login){
                    flag = false;
                }
            }
            if (!(flag)){ //если есть - шлём нахуй, хотя надо попросить придумать другой логин
                console.log("User already exist!");
            }else{ //если нет - делаем новую запись в бд и все круто классно
                connection.query("INSERT INTO users (login, password, permissions) VALUES (login, password, 0)", function (err, result){
                    if (err) throw err;
                    console.log("Registration success!");
                });
            }
        });
        connection.end();
    });
}
export default function (){registration()};