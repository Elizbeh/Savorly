import { validateEmail, validatePassword } from '../../utils/validation';

test("validates a proper email", () => {
  expect(validateEmail("user@example.com")).toBe(true);
});

test("rejects an invalid email", () => {
  expect(validateEmail("user@com")).toBe(false);
});

test("validates a strong password", () => {
  expect(validatePassword("Valid123!")).toBe(true);
});

test("rejects a weak password", () => {
  expect(validatePassword("123")).toBe(false);
});
