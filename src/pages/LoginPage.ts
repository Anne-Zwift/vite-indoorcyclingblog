import { login as loginApi } from '../api/Client';
import { login } from '../utils/store';
import { navigate } from '../utils/router';

/**
 * Renders the login page structure, including the form and submission logic.
 * @returns {HTMLDivElement} The container element for the Login Page.
 */

export function LoginPage(): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.className =
    'flex flex-col items-center justify-center py-12 w-full';

  const card = document.createElement('div');
  card.className =
    'w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100';

  const title = document.createElement('h2');
  title.textContent = 'Log in to Indoor Cycling!';
  title.className =
    'text-2xl font-bold text-center mb-2 text-sky-600 md:text-3xl xl:text-4xl';

  const messageArea = document.createElement('div');
  messageArea.id = 'loginMessage';
  /* messageArea.className = 'message-area'; */
  /* messageArea.style.color = 'red'; */
  messageArea.className = 'text-sm text-red-500 text-center mb-4';

  const loginForm = document.createElement('form');
  /*   loginForm.id = 'loginForm';
  loginForm.className = 'login-form'; */
  loginForm.className = 'space-y-4';

  loginForm.innerHTML = `
  <div class="form-group space-y-1">
   <label class="block text-sm font-semibold text-gray-700 mb-1 md:text-lg lg:text-xl" for="email">Email</label>
   <input type="email" id="email" name="email" required minlength="8" class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none" >
  </div>
  <div class="form-group">
   <label class="block text-sm font-semibold text-gray-700 mb-1 md:text-lg lg:text-xl" for="password">Password</label>
   <input type="password" id="password" name="password" required minlength="8" class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none">
  </div>
   <button type="submit" id="loginSubmitButton" class="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 active:scale-[0.98] transition-all shadow-md mt-4">Log In</button>
  `;

  loginForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    messageArea.textContent = '';
    messageArea.style.color = 'red';

    const submitButton = loginForm.querySelector(
      '#loginSubmitButton',
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Logging In...';
    }

    const formData = new FormData(loginForm);
    const email = (formData.get('email') as string).trim();
    const password = (formData.get('password') as string).trim();

    if (!email || !password) {
      messageArea.textContent = 'Please enter both email and password.';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Log In';
      }
      return;
    }

    let userMessage: string = '';

    try {
      const result = await loginApi(email, password);

      const { accessToken, profile: profileData } = result;

      if (!accessToken || !profileData) {
        throw new Error(
          'Login failed. Missing token or profile data in API response.',
        );
      }

      login(result.accessToken, result.profile);

      messageArea.textContent = 'Login successful! Redirecting to feed...';
      messageArea.style.color = 'green';
      messageArea.textContent = userMessage;

      console.log('Login successful. Profile:', result);

      setTimeout(() => {
        navigate('/feed');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);

      userMessage = 'An unknown error occurred during login. Please try again.';

      if (error instanceof Error) {
        if (
          error.message.includes('Invalid credentials') ||
          error.message.includes('Invalid email or password')
        ) {
          userMessage = 'Invalid email or password. Please try again.';
        } else {
          userMessage = error.message;
        }
      }
      messageArea.textContent = userMessage;
    } finally {
      if (submitButton && messageArea.style.color !== 'green') {
        submitButton.disabled = false;
        submitButton.textContent = 'Log In';
      }
    }
  });

  card.append(title, messageArea, loginForm);
  pageContainer.append(card);

  return pageContainer;
}
