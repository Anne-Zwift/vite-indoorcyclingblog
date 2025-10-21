import { login as loginApi } from '../api/Client';
import { login } from '../utils/store';
import { navigate } from '../utils/router';


/**
 * Renders the login page structure, including the form and submission logic.
 * @returns {HTMLDivElement} The container element for the Login Page.
 */

export function LoginPage(): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'login-page-container';
  
  const title = document.createElement('h2');
  title.textContent = 'User Login';

  const messageArea = document.createElement('div');
  messageArea.id = 'loginMessage';
  messageArea.className = 'message-area';
  messageArea.style.color = 'red';

  const loginForm = document.createElement('form');
  loginForm.id = 'loginForm';
  loginForm.className = 'login-form';

  loginForm.innerHTML = `
  <div class="form-group">
   <label for="username">Email/Username:</label>
   <input type="text" id="username" name="username" required>
  </div>
  <div class="form-group">
   <label for="password">Password:</label>
   <input type="password" id="password" name="password" required>
  </div>
   <button type="submit" id="loginSubmitButton">Log In</button>
  `;

  loginForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault(); //stop page reload
    messageArea.textContent = ''; //clear old messages
    messageArea.style.color = 'red';

    const formData = new FormData(loginForm);
    const email = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      messageArea.textContent = "Please enter username/email and password.";
      return;
    }

    try {
      const result = await loginApi(email, password);

      login(result.accessToken, result.profile);

      messageArea.textContent = 'Login successful! Redirecting to feed...';
      messageArea.style.color = 'green';

      console.log('Login successful. Profile:', result.profile);

      setTimeout(() => {
        navigate('/');
      }, 1000);


    } catch (error) {
      console.error('Login error:', error);
      messageArea.textContent = error instanceof Error ? error.message : 'An unknown error occurred during login.';
    }

  });

  pageContainer.append(title, messageArea, loginForm);


  return pageContainer;
}