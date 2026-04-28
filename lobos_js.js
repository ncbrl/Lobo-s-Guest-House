/* ============================================================
   LOBO'S GUEST HOUSE — JavaScript
   ============================================================ */

'use strict';

// ── Slideshow ──────────────────────────────────────────────
let slideIndex = 1;
let slideTimer;

document.addEventListener('DOMContentLoaded', () => {
    showSlides(slideIndex);
    startAutoSlide();
    setupFormValidation();
    setupScrollBehavior();
    setupRevealObserver();
});

function showSlides(n) {
    const slides = document.getElementsByClassName('slide');
    const dots   = document.getElementsByClassName('dot');

    if (!slides.length) return;

    if (n > slides.length) slideIndex = 1;
    if (n < 1)             slideIndex = slides.length;

    Array.from(slides).forEach(s => s.classList.remove('active'));
    Array.from(dots).forEach(d => d.classList.remove('active'));

    slides[slideIndex - 1].classList.add('active');
    if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add('active');
}

function changeSlide(n) {
    clearInterval(slideTimer);
    showSlides(slideIndex += n);
    startAutoSlide();
}

function currentSlide(n) {
    clearInterval(slideTimer);
    showSlides(slideIndex = n);
    startAutoSlide();
}

function startAutoSlide() {
    slideTimer = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 3500);
}

// ── Smooth Scroll ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ── Navigation Scroll Behaviour ────────────────────────────
function setupScrollBehavior() {
    const heroNav   = document.getElementById('heroNav');
    const mainNav   = document.getElementById('mainNav');
    const heroSec   = document.getElementById('home');

    if (!heroNav || !mainNav || !heroSec) return;

    const handleScroll = () => {
        const heroBottom = heroSec.offsetHeight - 80;
        const scrolled   = window.scrollY;

        if (scrolled > heroBottom) {
            heroNav.classList.add('scrolled');
            mainNav.classList.add('nav-sticky');
        } else {
            heroNav.classList.remove('scrolled');
            mainNav.classList.remove('nav-sticky');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// ── Reveal on Scroll ───────────────────────────────────────
function setupRevealObserver() {
    const els = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(el => observer.observe(el));
}

// ── Form Validation & Submission ───────────────────────────
function setupFormValidation() {
    const bookingForm  = document.getElementById('bookingForm');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    if (!bookingForm) return;

    // Set minimum check-in date to today
    const today = new Date().toISOString().split('T')[0];
    checkinInput.setAttribute('min', today);

    checkinInput.addEventListener('change', function() {
        const next = new Date(this.value);
        next.setDate(next.getDate() + 1);
        const minCheckout = next.toISOString().split('T')[0];
        checkoutInput.setAttribute('min', minCheckout);
        if (checkoutInput.value && checkoutInput.value < minCheckout) {
            checkoutInput.value = '';
        }
    });

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const checkin  = new Date(checkinInput.value);
        const checkout = new Date(checkoutInput.value);

        if (checkout <= checkin) {
            alert('Check-out date must be after check-in date.');
            return;
        }

        const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

        const data = {
            name:     document.getElementById('name').value,
            email:    document.getElementById('email').value,
            phone:    document.getElementById('phone').value,
            guests:   document.getElementById('guests').value,
            checkin:  checkinInput.value,
            checkout: checkoutInput.value,
            message:  document.getElementById('message').value
        };

        const body = `Booking Enquiry — Lobo's Guest House
=====================================

Name:    ${data.name}
Email:   ${data.email}
Phone:   ${data.phone}
Guests:  ${data.guests}

Check-in:  ${data.checkin}
Check-out: ${data.checkout}
Nights:    ${nights}

Special Requests:
${data.message || 'None'}

=====================================
Please reply to confirm availability.
`;

        const mailto = `mailto:lobosguesthousecandolim@gmail.com?subject=Booking Enquiry — ${encodeURIComponent(data.name)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;

        alert('Thank you for your enquiry!\n\nYour email client will open with a pre-filled message. Please send it to complete your request. We will respond within 24 hours.');
        bookingForm.reset();
    });
}

// ── Prevent form resubmission on refresh ──────────────────
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
