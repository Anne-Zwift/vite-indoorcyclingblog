import { register as registerApi } from '../api/Client';
import { navigate } from '../utils/router';

/**
 * Renders the register page structure, including the form and submission logic.
 * @returns {HTMLDivElement} The container element for the Register Page.
 */

export function RegisterPage(): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.className =
    'register-page-container flex flex-col items-center justify-center py-12 w-full';

  const card = document.createElement('div');
  card.className =
    'w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-slate-700';

  const title = document.createElement('h2');
  title.textContent = 'Register New User';
  title.className =
    'text-2xl font-bold text-center mb-2 text-sky-600 md:text-3xl xl:text-4xl';

  const messageArea = document.createElement('div');
  messageArea.id = 'registerMessage';
  messageArea.className = 'message-area text-sm text-red-500 text-center mb-4';
  /* messageArea.style.color = 'black'; */

  const registerForm = document.createElement('form');
  registerForm.id = 'registerForm';
  registerForm.className = 'register-form space-y-4';

  registerForm.innerHTML = `
  <div class="form-group space-y-1">
   <label class="block text-sm font-semibold text-gray-700 dark:text-slate-100 mb-1 md:text-lg lg:text-xl" for="username">Username:</label>
   <input class="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none type="text" id="username" name="username" required>
  </div>
  <div class="form-group">
   <label class="block text-sm font-semibold text-gray-700 dark:text-slate-100 mb-1 md:text-lg lg:text-xl for="email">Email:</label>
   <input class="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none type="email" id="email" name="email" required>
  </div>
  <div class="form-group">
   <label class="block text-sm font-semibold text-gray-700 dark:text-slate-100 mb-1 md:text-lg lg:text-xl for="password">Password:</label>
   <input class="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none type="password" id="password" name="password" required>
  </div>
   <button class="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 active:scale-[0.98] transition-all shadow-md mt-4" type="submit" id="registerSubmitButton">Register</button>
  `;

  registerForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    messageArea.textContent = '';
    messageArea.style.color = 'black';

    const submitButton = registerForm.querySelector(
      '#registerSubmitButton',
    ) as HTMLButtonElement;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Registering...';
    }

    const formData = new FormData(registerForm);
    const username = (formData.get('username') as string).trim();
    const email = (formData.get('email') as string).trim();
    const password = (formData.get('password') as string).trim();

    if (!username || !email || !password) {
      messageArea.textContent = 'Please fill in your credentials.';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
      }
      return;
    }

    /*new code*/
    const nameInvalidChars = /[^A-Za-z0-9_]/g;
    if (nameInvalidChars.test(username)) {
      messageArea.textContent =
        'Username must only contain letters, numbers, and underscores.';

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
      }
      return;
    }

    const noroffEmailRegex = /^[A-Za-z0-9._%+-]+@stud\.noroff.no$/;
    if (!noroffEmailRegex.test(email)) {
      messageArea.textContent =
        'Email must be a valid @stud.noroff.no address.';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
      }
      return;
    }

    if (password.length < 8) {
      messageArea.textContent = 'Password must be at least 8 characters long.';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
      }
      return;
    }

    let userMessage: string = '';
    let shouldRedirectToLogin: boolean = false;

    try {
      await registerApi(username, email, password);

      messageArea.textContent =
        'Registration successful! Redirecting to login page...';
      messageArea.style.color = 'green';

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);

      userMessage = 'An unknown error occurred during registration.';

      if (error instanceof Error) {
        if (error.message.includes('Profile already exists')) {
          userMessage =
            'This email address is already registered. Redirecting to login...';
          shouldRedirectToLogin = true;
        } else {
          userMessage = error.message;
        }
      }

      messageArea.textContent = userMessage;

      if (shouldRedirectToLogin) {
        messageArea.style.color = 'black';

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } finally {
      if (
        submitButton &&
        !shouldRedirectToLogin &&
        messageArea.style.color !== 'green'
      ) {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
      }
    }
  });

  card.append(title, messageArea, registerForm);
  pageContainer.append(card);

  return pageContainer;
}
