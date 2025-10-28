/**
 * Displays a simple modal and returns a Promise that resolves tru/false.
 * @param {string} message - The text to display in the modal.
 * @returns {Promise<boolean>} True if confirmed, false otherwise.
 */

export function showConfirmationModal(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalBox = document.createElement('div');
    modalBox.className = 'modal-box';

    modalBox.innerHTML = `
    <p class="text-lg font-semibold mb-4">${message}</p>
    <div class="flex justify-end space-x-3">
      <button id="cancelButton" class="modal-button modal-button-cancel">Cancel</button>
      <button id="confirmButton" class="modal-button modal-button-confirm">Confirm Delete</button>
    </div>
    `;

    const cleanup = (result: boolean) => {
      modalOverlay.remove();
      resolve(result);
    };

    modalBox.querySelector('#cancelButton')?.addEventListener('click', () => cleanup(false));
    modalBox.querySelector('#confirmButton')?.addEventListener('click', () => cleanup(true));

    modalOverlay.appendChild(modalBox);

    document.body.appendChild(modalOverlay);
  });
}