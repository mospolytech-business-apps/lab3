import { describe, expect, it } from 'vitest';
import { validatePassword } from "./validate-password";

// Описать группу тестов для функции validatePassword
describe('validatePassword', () => {
    // Описать тестовый случай для проверки длины пароля
    it('should check that password has between 5 and 20 characters', () => {
        // Определить входные данные и ожидаемые результаты
        const username = 'user123';
        const validPassword = 'Abcde123';
        const validPasswordLength5 = 'Abc12';
        const validPasswordLength20 = 'Abc12678901234567890';
        const tooShortPassword = 'a';
        const tooLongPassword = '123456789012345678901';
        // Вызвать функцию validatePassword с входными данными и сравнить результат с ожидаемым с помощью expect и toBe
        expect(validatePassword(validPassword, username)).toBe(true);
        expect(validatePassword(validPasswordLength5, username)).toBe(true);
        expect(validatePassword(validPasswordLength20, username)).toBe(true);
        expect(validatePassword(tooShortPassword, username)).toBe(false);
        expect(validatePassword(tooLongPassword, username)).toBe(false);
    });
    // Описать тестовый случай для проверки отсутствия логина в пароле
    it('should check that password does not contain username', () => {
        // Определить входные данные и ожидаемые результаты
        const username = 'user123';
        const validPassword = 'Abcde123';
        const invalidPassword = 'user123Abcde';
        // Вызвать функцию validatePassword с входными данными и сравнить результат с ожидаемым с помощью expect и toBe
        expect(validatePassword(validPassword, username)).toBe(true);
        expect(validatePassword(invalidPassword, username)).toBe(false);
    });
    // Описать тестовый случай для проверки наличия заглавной буквы в пароле
    it('should check that password has at least one uppercase letter', () => {
        // Определить входные данные и ожидаемые результаты
        const username = 'user123';
        const validPassword = 'Abcde123';
        const invalidPassword = 'abcde123';
        // Вызвать функцию validatePassword с входными данными и сравнить результат с ожидаемым с помощью expect и toBe
        expect(validatePassword(validPassword, username)).toBe(true);
        expect(validatePassword(invalidPassword, username)).toBe(false);
    });
    // Описать тестовый случай для проверки наличия маленькой буквы в пароле
    it('should check that password has at least one lowercase letter', () => {
        // Определить входные данные и ожидаемые результаты
        const username = 'user123';
        const validPassword = 'Abcde123';
        const invalidPassword = 'ABCDE123';
        // Вызвать функцию validatePassword с входными данными и сравнить результат с ожидаемым с помощью expect и toBe
        expect(validatePassword(validPassword, username)).toBe(true);
        expect(validatePassword(invalidPassword, username)).toBe(false);
    });
});
