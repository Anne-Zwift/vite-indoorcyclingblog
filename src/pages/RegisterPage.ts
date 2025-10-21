import { register as registerApi } from '../api/Client';
import { navigate } from '../utils/router';


/**
 * Renders the register page structure, including the form and submission logic.
 * @returns {HTMLDivElement} The container element for the Register Page.
 */

export function RegisterPage(): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'register-page-container';
  
  const title = document.createElement('h2');
  title.textContent = 'Register New User';

  const messageArea = document.createElement('div');
  messageArea.id = 'registerMessage';
  messageArea.className = 'message-area';
  messageArea.style.color = 'red';

  const registerForm = document.createElement('form');
  registerForm.id = 'registerForm';
  registerForm.className = 'register-form';

  registerForm.innerHTML = `
  <div class="form-group">
   <label for="username">Username:</label>
   <input type="text" id="username" name="username" required>
  </div>
  <div class="form-group">
   <label for="email">Email:</label>
   <input type="email" id="email" name="email" required>
  </div>
  <div class="form-group">
   <label for="password">Password:</label>
   <input type="password" id="password" name="password" required>
  </div>
   <button type="submit" id="registerSubmitButton">Register</button>
  `;

  registerForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault(); //stop page reload
    messageArea.textContent = ''; //clear old messages
    messageArea.style.color = 'red';

    const submitButton = registerForm.querySelector('#registerSubmitButton') as HTMLButtonElement;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Registering...";
    }
      
      const formData = new FormData(registerForm);
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!username || !email || !password) {
        messageArea.textContent = "Please fill in your credentials.";
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Register';
        }
        return;
      }

    try {
     await registerApi(username, email, password);

      messageArea.textContent = 'Registration successful! Redirecting to login page...';
      messageArea.style.color = 'green';

      console.log('Registration successful.');

      setTimeout(() => {
        navigate('/login');
      }, 1000);


    } catch (error) {
      console.error('Registration error:', error);
      messageArea.textContent = error instanceof Error ? error.message : 'An unknown error occurred during registration.';
    } finally {
      if (submitButton && messageArea.style.color !== 'green') {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
      }
    }

  });

  pageContainer.append(title, messageArea, registerForm);


  return pageContainer;
}