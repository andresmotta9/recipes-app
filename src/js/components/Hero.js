// src/js/components/Hero.js
export default function Hero() {
  const hero = document.createElement('div');
  hero.classList.add('hero');

  hero.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-md-12 hero-content">
          <h1>Welcome to the recipe app</h1>
          <h3>Take a look at your recipes or create a new one</h3>
        </div>
        <div class="col-lg-6 col-md-12 hero-image">
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Delicious food">
        </div>
      </div>
    </div>
  `;

  return hero;
}
