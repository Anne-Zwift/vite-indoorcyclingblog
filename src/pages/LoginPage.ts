import { login as loginApi } from '../api/Client';
import { login } from '../utils/store'; // should save the data
import { navigate } from '../utils/router';
//import type { UserProfileData } from '../types/Profile';
//import { setApiKey } from '../utils/authUtils';



/**
 * Renders the login page structure, including the form and submission logic.
 * @returns {HTMLDivElement} The container element for the Login Page.
 */

export function LoginPage(): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'login-page-container';
  
  const title = document.createElement('h2');
  title.textContent = 'Welcome to Indoor Cycling!';

  const messageArea = document.createElement('div');
  messageArea.id = 'loginMessage';
  messageArea.className = 'message-area';
  messageArea.style.color = 'red';

  const loginForm = document.createElement('form');
  loginForm.id = 'loginForm';
  loginForm.className = 'login-form';

  loginForm.innerHTML = `
  <div class="form-group">
   <label for="email">Email</label>
   <input type="email" id="mail" name="email" required>
  </div>
  <div class="form-group">
   <label for="password">Password</label>
   <input type="password" id="password" name="password" required>
  </div>
   <button type="submit" id="loginSubmitButton">Log In</button>
  `;

  loginForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault(); //stop page reload
    messageArea.textContent = ''; //clear old messages
    messageArea.style.color = 'red';

    /*new code */
    const submitButton = loginForm.querySelector('#loginSubmitButton') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Logging In...';
    }
    /*new code ends*/

    const formData = new FormData(loginForm);
    const email = (formData.get('email') as string).trim();
    const password = (formData.get('password') as string).trim();

    if (!email || !password) {
      messageArea.textContent = "Please enter both email and password.";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Log In';
      }
      return;
    }

    let userMessage: string = '';

    try {
      const result = await loginApi(email, password);// result: {accessToken, profile}

      const { accessToken, profile: profileData } = result;

      if (!accessToken || !profileData) {
       throw new Error("Login failed. Missing token or profile data in API response.");
      }

      login(result.accessToken, result.profile);//responsible for saving the data

      messageArea.textContent = 'Login successful! Redirecting to feed...';
      messageArea.style.color = 'green';
      messageArea.textContent = userMessage;

      console.log('Login successful. Profile:', result);

      setTimeout(() => {
        navigate('/feed');
      }, 4000);


    } catch (error) {
      console.error('Login error:', error);

      userMessage = 'An unknown error occurred during login. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid credentials') || error.message.includes('Invalid email or password')) {
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

  pageContainer.append(title, messageArea, loginForm);


  return pageContainer;
}