/**
 * Displays a simple modal and returns a Promise that resolves tru/false.
 * @param {string} message - The text to display in the modal.
 * @returns {Promise<boolean>} True if confirmed, false otherwise.
 */

export function showConfirmationModal(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className =
      'modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-grayscale p-4';

    const modalBox = document.createElement('div');
    modalBox.className =
      'modal-box bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center border border-slate-100 dark:border-slate-600 flex flex-col w gap-6 animate-in fade-in zoom-in duration-200';

    modalBox.innerHTML = `
    <p class="text-lg font-semibold mb-4 flex justify-center">${message}</p>
    <div class="flex justify-center space-x-3">
      <button id="cancelButton" class="modal-button modal-button-cancel w-28 bg-sky-300 hover:bg-sky-500 dark:bg-sky-700 dark:hover:bg-sky-900 cursor-pointer p-1.5 m-2 rounded-xl">Cancel</button>
      <button id="confirmButton" class="modal-button modal-button-confirm w-40 bg-sky-300 dark:bg-sky-700 hover:bg-sky-500 dark:hover:bg-sky-900 cursor-pointer p-1.5 m-2 rounded-xl">Confirm Delete</button>
    </div>
    `;

    const cleanup = (result: boolean) => {
      modalOverlay.remove();
      resolve(result);
    };

    modalBox
      .querySelector('#cancelButton')
      ?.addEventListener('click', () => cleanup(false));
    modalBox
      .querySelector('#confirmButton')
      ?.addEventListener('click', () => cleanup(true));

    modalOverlay.appendChild(modalBox);

    document.body.appendChild(modalOverlay);
  });
}
