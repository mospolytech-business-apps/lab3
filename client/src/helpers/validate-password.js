export function validatePassword(password, username) {
    // Проверить, что пароль содержит от 5 до 20 символов
    if (password.length < 5 || password.length > 20) {
        return false;
    }
    // Проверить, что пароль не содержит логин
    if (password.includes(username)) {
        return false;
    }
    // Проверить, что пароль содержит хотя бы одну заглавную букву
    if (!password.match(/[A-Z]/)) {
        return false;
    }
    // Проверить, что пароль содержит хотя бы одну маленькую букву
    if (!password.match(/[a-z]/)) {
        return false;
    }
    // Если все проверки пройдены, вернуть true
    return true;
}
