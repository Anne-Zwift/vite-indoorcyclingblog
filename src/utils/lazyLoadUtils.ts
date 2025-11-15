/**
 * Sets up an Intersection Observer to detect when a 'sentinel' element enters the viewport, typically used for implementing infinite scrolling.
 * @param {() => void} callback - The function to execute when the sentinel enters the viewport (i.e.,fetch more data).
 * @param {HTMLElement} sentinel - The element placed at the bottom of the content stream to observe.
 * @returns {IntersectionObserver} The configured observer instance.
 */

export function setupInfiniteScrollObserver(callback: () => void, sentinel: HTMLElement): IntersectionObserver {

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin:'0px 0px 500px 0px',
    threshold: 0.01,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);

        callback();
      }
    });
  
}, observerOptions);

observer.observe(sentinel);

return observer;

}