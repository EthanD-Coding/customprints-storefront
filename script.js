const products = [
  { id: 1, name: "The Everyday Tote", category: "Accessories", price: 8.90, oldPrice: 14.50, tag: "Bestseller", hot: true, image: "https://images.unsplash.com/photo-1590874900884-7d4c7f2a6f4d?auto=format&fit=crop&w=700&q=85" },
  { id: 2, name: "Heavyweight Graphic Tee", category: "Apparel", price: 12.40, oldPrice: 19.90, tag: "Hot right now", hot: true, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85" },
  { id: 3, name: "Your Words Mug", category: "Home", price: 6.75, oldPrice: 10.00, tag: "Staff pick", hot: false, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85" },
  { id: 4, name: "Pocket Art Print", category: "Home", price: 4.20, oldPrice: 7.00, tag: "New drop", hot: true, image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=700&q=85" },
  { id: 5, name: "Custom Phone Case", category: "Accessories", price: 9.50, oldPrice: 15.00, tag: "Trending", hot: true, image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=700&q=85" },
  { id: 6, name: "Personalised Crewneck", category: "Apparel", price: 21.90, oldPrice: 32.00, tag: "Comfy favourite", hot: false, image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=700&q=85" },
  { id: 7, name: "Little Moments Notebook", category: "Gifts", price: 5.60, oldPrice: 8.90, tag: "Giftable", hot: false, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=85" },
  { id: 8, name: "Everywhere Water Bottle", category: "Accessories", price: 11.20, oldPrice: 17.50, tag: "Popular", hot: true, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85" }
];

let activeCategory = "All";
let cartCount = 0;
const trendingGrid = document.getElementById("trendingGrid");
const shopGrid = document.getElementById("shopGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");
const toast = document.getElementById("toast");
let toastTimer;

function money(value) { return "$" + value.toFixed(2); }

function productCard(product) {
  return `<article class="product-card">
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(145deg,#e5d8c7,#c9b8ff)'">
      <span class="product-tag ${product.hot ? "hot" : ""}">${product.tag}</span>
      <button class="quick-add" data-add="${product.id}">Quick add <span>＋</span></button>
    </div>
    <div class="product-info"><div><h3>${product.name}</h3><p class="product-category">${product.category}</p></div>
      <div class="product-price"><del>${money(product.oldPrice)}</del> ${money(product.price)}</div></div>
  </article>`;
}

function renderTrending() {
  trendingGrid.innerHTML = products.filter(p => p.hot).slice(0, 4).map(productCard).join("");
}

function renderShop() {
  const query = searchInput.value.trim().toLowerCase();
  let filtered = products.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
    `${p.name} ${p.category} ${p.tag}`.toLowerCase().includes(query));
  if (sortSelect.value === "low") filtered.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "high") filtered.sort((a, b) => b.price - a.price);
  shopGrid.innerHTML = filtered.length ? filtered.map(productCard).join("") : '<p class="empty-results">No matches just yet. Try another search.</p>';
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`;
  document.querySelectorAll(".filter-chip").forEach(button => button.classList.toggle("active", button.dataset.category === activeCategory));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const product = products.find(p => p.id === Number(addButton.dataset.add));
    cartCount++;
    document.getElementById("cartCount").textContent = cartCount;
    showToast(`${product.name} added to your bag (demo)`);
  }
  const categoryLink = event.target.closest("[data-category]");
  if (categoryLink && categoryLink.classList.contains("filter-chip")) {
    activeCategory = categoryLink.dataset.category;
    renderShop();
  } else if (categoryLink && categoryLink.closest(".category-strip")) {
    activeCategory = categoryLink.dataset.category;
    renderShop();
  }
});

searchInput.addEventListener("input", renderShop);
sortSelect.addEventListener("change", renderShop);
document.getElementById("cartButton").addEventListener("click", () => showToast(`Your demo bag has ${cartCount} ${cartCount === 1 ? "item" : "items"}. Checkout isn't connected yet.`));
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("newsletterMessage").textContent = "You're on the list — demo signup only, no email was sent.";
  event.target.reset();
});
document.getElementById("menuButton").addEventListener("click", event => {
  const nav = document.querySelector(".desktop-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".desktop-nav a").forEach(link => link.addEventListener("click", () => {
  document.querySelector(".desktop-nav").classList.remove("open");
  document.getElementById("menuButton").setAttribute("aria-expanded", "false");
}));

renderTrending();
renderShop();
