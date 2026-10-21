(() => {
  const config = window.OG_CONFIG || {};
  document.querySelectorAll('[data-link]').forEach(link => {
    const destination = config.links?.[link.dataset.link];
    if (!destination) return;
    // Permit standard web and contact destinations; reject executable URL schemes.
    try {
      const url = new URL(destination, window.location.href);
      if (!['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol)) return;
      link.href = url.href;
      link.removeAttribute('aria-disabled');
      link.removeAttribute('title');
    } catch { /* Leave malformed destinations unassigned. */ }
  });
  document.querySelectorAll('[data-dialog]').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.dialog).showModal());
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  });
  const form = document.getElementById('signup-form');
  if (!config.waitlistEndpoint) return;
  document.getElementById('signup-unavailable').hidden = true;
  form.hidden = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    const status = document.getElementById('signup-status');
    button.disabled = true;
    status.textContent = 'Joining…';
    const fields = new FormData(form);
    try {
      const response = await fetch(config.waitlistEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: String(fields.get('email')).trim(), website: fields.get('website') })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Could not join right now. Please try again.');
      }
      status.textContent = 'You’re on the list. Thank you for joining.';
      form.reset();
    } catch (error) {
      status.textContent = error.message || 'Could not connect. Please try again.';
    } finally { button.disabled = false; }
  });
})();
