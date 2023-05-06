# shared-db
내부 데이터베이스에 대한 접근 인터페이스

# Environment Varaibles
- `LOGIN_DB_HOST`: host of login database
- `LOGIN_DB_PORT`: port of login database
- `LOGIN_DB_USER`: user of login database
- `LOGIN_DB_PASSWORD`: password of login database
- `LOGIN_DB_DATABASE`: database of login database
- `MAIN_DB_URI`: uri of main database
- `CHAT_DB_URI`: uri of chat database

# Example
```
import SharedDB from 'shared-db';
(async function () {
    const sharedDB = new SharedDB();
    sharedDB.useLogin();
    const result = await sharedDB.login.tryLogin('username', 'password');
})()
```