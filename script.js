const header = document.querySelector(".site-header");

const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const selector = anchor.getAttribute("href");
        if (!selector || selector === "#") return;
        const target = document.querySelector(selector);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
document.querySelectorAll(".project-card, .wide-card, .log-card").forEach((card) => {
    const link = card.querySelector("a[href]");
    if (!link) return;

    const label = card.querySelector("h2, h3")?.textContent?.trim() || link.textContent.trim() || "자세히 보기";
    card.classList.add("clickable-card");
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", label);

    card.addEventListener("click", (event) => {
        if (event.target.closest("a, button, input, textarea, select")) return;
        if (link.target === "_blank") {
            window.open(link.href, "_blank", "noopener");
            return;
        }
        window.location.href = link.href;
    });

    card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        link.click();
    });
});

const contactForm = document.querySelector("#contact-form");
const contactBody = document.querySelector("#contact-body");

if (contactForm && contactBody) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const body = contactBody.value.trim();
        const subject = encodeURIComponent("안심이 참여 문의");
        const message = encodeURIComponent(body);
        window.location.href = `mailto:ansim@codefor.kr?subject=${subject}&body=${message}`;
    });
}
// Defensive cleanup for cached listing-page markup.
document.querySelectorAll('.nav-links a[href*="#contact"]').forEach((link) => link.remove());

if (location.pathname.endsWith('/projects/') || location.pathname.endsWith('/projects/index.html') || location.pathname.endsWith('/blog.html')) {
    document.querySelectorAll('.sub-hero.fluid-subhero').forEach((section) => section.remove());
}