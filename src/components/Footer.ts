/**
 * Creates the main application footer.
 * @returns {HTMLElement} The footer element.
 */

export function Footer(): HTMLElement {
  const footer = document.createElement('footer');
/*   footer.classList.add('main-footer'); */
  footer.className =
    'main-footer w-full max-w-5xl mt-auto mx-auto px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800';

  const copyright = document.createElement('p');
  copyright.innerHTML = `&copy; ${new Date().getFullYear()} Indoor Cycling Blog.`;

  const contact = document.createElement('a');
  contact.href = 'mailto:contact@blog.com';
  contact.textContent = 'Contact Us';
  contact.className = 'mt-2 inline-block text-(--color-secondary) hover:underline';

  footer.append(copyright, contact);

  return footer;
}
