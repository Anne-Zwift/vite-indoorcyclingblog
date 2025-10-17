/**
 * Creates the main application footer.
 * @returns {HTMLElement} The footer element.
 */


export function Footer(): HTMLElement {
  const footer = document.createElement('footer');
  footer.classList.add('main-footer');

  const copyright = document.createElement('p');
  copyright.innerHTML = `&copy; ${new Date().getFullYear()} Indoor Cycling Blog.`

  const contact = document.createElement('a');
  contact.href = 'mailto:contact@blog.com';
  contact.textContent = 'Contact Us';

  footer.append(copyright, contact);

  return footer;
}