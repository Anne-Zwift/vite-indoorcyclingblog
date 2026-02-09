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
    'min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4';

  const card = document.createElement('div');
  card.className = 'w-full max-w-md bg-white rounded-xl shadow-lg p-6';

  const title = document.createElement('h2');
  title.textContent = 'Welcome to Indoor Cycling!';
  title.className =
    'text-xl font-bold text-center mb-6 text-sky-600 md:text-2xl xl:text-4xl';

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
  <div class="form-group">
   <label class="block text-sm font-medium mb-1 md:text-lg lg:text-xl" for="email">Email</label>
   <input type="email" id="mail" name="email" required minlength="8" class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" >
  </div>
  <div class="form-group">
   <label class="block text-sm font-medium mb-1 md:text-lg lg:text-xl" for="password">Password</label>
   <input type="password" id="password" name="password" required minlength="8" class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
  </div>
   <button type="submit" id="loginSubmitButton" class="w-full bg-blue-400 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">Log In</button>
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
