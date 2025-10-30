/**
 * Displays a temporary, non-blocking message at the top of a specified container element.
 * @param container - The Dom element where the message should be prepended (e.g., the article or the feed container)
 * @param message - The text content of the message.
 * @param isError - If true, styles the message for an error; otherwise, styles it for success/info.
 */

export function showTempMessage(container: HTMLElement, message: string, isError: boolean): void {

let messageEl = container.querySelector('.temp-message') as HTMLDivElement;

if (!messageEl) {
  messageEl = document.createElement('div');
  messageEl.classList.add('temp-message', 'p-2', 'rounded', 'mb-2', 'text-center');
  container.prepend(messageEl);
}

messageEl.textContent = message;

messageEl.classList.remove('bg-red-100', 'bg-green-100', 'text-red-800', 'text-green-800');
if (isError) {
  messageEl.classList.add('bg-red-100', 'text-red-800');
} else {
  messageEl.classList.add('bg-green-100', 'text-green-800');
}

setTimeout(() => {
  messageEl.remove();
}, 2500);
};


