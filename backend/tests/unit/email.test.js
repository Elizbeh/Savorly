const nodemailer = require('nodemailer');
const { sendEmail } = require('../../services/emailService');

// Mock the nodemailer module
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn() // We will mock sendMail dynamically in each test
  })
}));

describe('Email Service', () => {

  let sendMailMock;

  beforeEach(() => {
    sendMailMock = nodemailer.createTransport().sendMail;  // Reset mock before each test
    sendMailMock.mockClear(); // Clear any previous call history
  });

  test('should send an email successfully', async () => {
    sendMailMock.mockResolvedValue(true);  // Mock a successful email sending

    console.log('Calling sendEmail...');
    await sendEmail('test@example.com', 'Test Subject', 'Test Body');  // Call the sendEmail function

    // Ensure sendMail was called once with correct arguments
    expect(sendMailMock).toHaveBeenCalledTimes(1);  // Check that it was called
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: process.env.EMAIL_USER,
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Body'
    }));

    // Debugging - log the actual calls made to sendMail
    console.log('sendMail mock calls:', sendMailMock.mock.calls);
  });

  test('should handle email sending failure', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP error'));  // Mock failure response

    console.log('Testing email sending failure...');
    // Check that the error is thrown and rejected
    await expect(sendEmail('test@example.com', 'Test Subject', 'Test Body')).rejects.toThrow('SMTP error');

    // Ensure the rejection happened
    expect(sendMailMock).toHaveBeenCalledTimes(1);  // Ensure the function was called at least once

    // Debugging: Inspect the rejection
    console.log('sendMail failure mock calls:', sendMailMock.mock.calls);
  });

  test('should throw an error if required fields are missing', async () => {
    console.log('Testing missing fields...');
    await expect(sendEmail()).rejects.toThrow('All email fields (to, subject, text) are required.');
  });
});
