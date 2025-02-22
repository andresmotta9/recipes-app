export default function Navbar() {
  const navbar = document.createElement('nav');
  navbar.classList.add('navbar', 'navbar-expand-lg', 'navbar-light');

  navbar.innerHTML = `
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="assets/icon.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top">
        Recipe App
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <span class="nav-link name">German Andres Sanche Motta</span>
          </li>
        </ul>
      </div>
    </div>
  `;

  return navbar;
}
