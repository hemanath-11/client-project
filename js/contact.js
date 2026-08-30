/* ==========================================================================
   Pet Haven - Contact Form Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-page-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    const email = document.getElementById('contact-email').value;
    const itemTitle = document.getElementById('contact-interest').value || 'General Inquiry';
    const message = document.getElementById('contact-message').value;

    await db.saveEnquiry({
      customerName: name,
      phone: phone,
      email: email,
      itemTitle: itemTitle,
      message: message
    });

    contactForm.reset();
    showToast('Your message has been sent! Store management will reach out shortly.', 'success');
  });
});
