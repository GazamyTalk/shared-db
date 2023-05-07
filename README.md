# shared-db
내부 데이터베이스에 대한 접근 인터페이스


# Example
```
import SharedDB from 'shared-db';
(async function () {
    const sharedDB = new SharedDB(
        {
            loginDB: {
                host: "HOST",
                port: PORT,
                user: "USER",
                password: "PASSWORD",
                database: "DATABASE"
            }
        }
    );
    const result = await sharedDB.login.tryLogin('username', 'password');
    console.log(`login result: ${result}`);
    await sharedDB.close();
})()
```