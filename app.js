const FREE_DELIVERY_THRESHOLD = 50;
const CART_STORAGE_KEY = "hilltop-market-cart";
const ZIP_STORAGE_KEY = "hilltop-market-zip";

const products = [
  {
    id: "goat-curry-cuts",
    name: "Goat curry cuts",
    category: "Goat meat",
    unit: "1 lb · Bone-in",
    price: 12.99,
    badge: "PICKED FOR YOU",
    image: "photos/goat%20curry%20cut.jpg",
  },
  {
    id: "goat-shoulder-chops",
    name: "Goat shoulder chops",
    category: "Goat meat",
    unit: "1 lb · Perfect for grilling",
    price: 14.49,
    badge: "BUTCHER’S PICK",
    image: "photos/goat%20shoulder%20chop.jpg",
  },
  {
    id: "boneless-goat",
    name: "Boneless goat cubes",
    category: "Goat meat",
    unit: "1 lb · Ready for the pot",
    price: 15.99,
    badge: "READY TO COOK",
    image: "photos/goat%20boneless%20cubes.jpg",
  }
  {
    id: "beef-stew-meat",
    name: "Beef stew meat",
    category: "Beef",
    unit: "1 lb · Cut into hearty cubes",
    price: 9.99,
    badge: "SLOW COOK FAVORITE",
    image: "photos/beef-stew-meat.avif",
  },
  {
    id: "ground-beef",
    name: "Fresh ground beef",
    category: "Beef",
    unit: "1 lb · Weeknight ready",
    price: 8.49,
    badge: "WEEKDAY FAVORITE",
    image: "photos/Halal%20Ground%20Beef.jpg",
  },
  {
    id: "chicken-drumsticks",
    name: "Chicken drumsticks",
    category: "Chicken",
    unit: "1 lb · Family pack",
    price: 4.99,
    badge: "FAMILY FAVORITE",
    image: "photos/halal%20chicken%20drumpstick.webp",
  },
];

const productGrid = document.querySelector("#product-grid");
const cartDrawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const cartCount = document.querySelector("#cart-count");
const drawerCount = document.querySelector("#drawer-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const deliveryProgress = document.querySelector("#delivery-progress");
const searchInput = document.querySelector("#product-search");
const resultsMessage = document.querySelector("#results-message");
const emptyResults = document.querySelector("#empty-results");
const sortSelect = document.querySelector("#sort-products");
const clearFilterButton = document.querySelector("#clear-filter");
const toast = document.querySelector("#toast");
const deliveryZip = document.querySelector("#delivery-zip");

let activeCategory = "";
let searchQuery = "";
let cart = loadCart();
let toastTimeout;

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");
    if (!savedCart || typeof savedCart !== "object" || Array.isArray(savedCart)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(savedCart).filter(
        ([id, quantity]) =>
          products.some((product) => product.id === id) &&
          Number.isInteger(quantity) &&
          quantity > 0,
      ),
    );
  } catch (error) {
    console.error("Unable to load the saved cart.", error);
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Unable to save the cart.", error);
    showToast("Your cart couldn’t be saved on this device.");
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function renderProducts() {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  let visibleProducts = products.filter((product) => {
    const matchesCategory = !activeCategory || product.category === activeCategory;
    const matchesSearch =
      !normalizedQuery ||
      `${product.name} ${product.category} ${product.unit}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  switch (sortSelect.value) {
    case "price-asc":
      visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      visibleProducts = [...visibleProducts].sort((a, b) => b.price - a.price);
      break;
    case "name":
      visibleProducts = [...visibleProducts].sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  productGrid.replaceChildren(
    ...visibleProducts.map((product) => {
      const card = document.createElement("article");
      card.className = "product-card";

      const imageFrame = document.createElement("div");
      imageFrame.className = "product-image";
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      imageFrame.append(image);

      const badge = document.createElement("span");
      badge.className = "product-badge";
      badge.textContent = product.badge;
      imageFrame.append(badge);

      const details = document.createElement("div");
      details.className = "product-details";

      const category = document.createElement("p");
      category.className = "product-category";
      category.textContent = product.category;

      const name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = product.name;

      const unit = document.createElement("p");
      unit.className = "product-unit";
      unit.textContent = product.unit;

      const footer = document.createElement("div");
      footer.className = "product-card-footer";

      const price = document.createElement("span");
      price.className = "product-price";
      price.textContent = formatPrice(product.price);

      const addButton = document.createElement("button");
      addButton.className = "add-button";
      addButton.type = "button";
      addButton.dataset.addToCart = product.id;
      addButton.textContent = cart[product.id] ? `Add more · ${cart[product.id]} in cart` : "＋ Add";
      addButton.setAttribute("aria-label", `Add ${product.name} to cart`);

      footer.append(price, addButton);
      details.append(category, name, unit, footer);
      card.append(imageFrame, details);
      return card;
    }),
  );

  const hasResults = visibleProducts.length > 0;
  emptyResults.hidden = hasResults;
  productGrid.hidden = !hasResults;
  resultsMessage.textContent = normalizedQuery || activeCategory
    ? `${visibleProducts.length} ${visibleProducts.length === 1 ? "item" : "items"} found`
    : "";
  clearFilterButton.textContent = activeCategory || "All items";
  clearFilterButton.classList.toggle("active", !activeCategory);
}

function renderCart() {
  const entries = Object.entries(cart)
    .map(([id, quantity]) => {
      const product = getProduct(id);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean);
  const totalCount = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  cartCount.textContent = String(totalCount);
  drawerCount.textContent = `(${totalCount})`;
  cartSubtotal.textContent = formatPrice(subtotal);
  cartItems.replaceChildren(
    ...entries.map(({ product, quantity }) => {
      const item = document.createElement("article");
      item.className = "cart-item";

      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";
      image.loading = "lazy";

      const copy = document.createElement("div");
      copy.className = "cart-item-copy";

      const name = document.createElement("h3");
      name.textContent = product.name;
      const unit = document.createElement("p");
      unit.textContent = product.unit;

      const control = document.createElement("div");
      control.className = "quantity-control";
      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.dataset.changeQuantity = product.id;
      decrease.dataset.amount = "-1";
      decrease.setAttribute("aria-label", `Remove one ${product.name}`);
      decrease.textContent = "−";
      const amount = document.createElement("span");
      amount.textContent = String(quantity);
      const increase = document.createElement("button");
      increase.type = "button";
      increase.dataset.changeQuantity = product.id;
      increase.dataset.amount = "1";
      increase.setAttribute("aria-label", `Add one ${product.name}`);
      increase.textContent = "+";
      control.append(decrease, amount, increase);

      copy.append(name, unit, control);
      const price = document.createElement("span");
      price.className = "cart-item-price";
      price.textContent = formatPrice(product.price * quantity);
      item.append(image, copy, price);
      return item;
    }),
  );

  const hasItems = totalCount > 0;
  cartEmpty.hidden = hasItems;
  cartSummary.hidden = !hasItems;
  deliveryProgress.hidden = !hasItems;
  deliveryProgress.innerHTML = remaining > 0
    ? `You’re <strong>${formatPrice(remaining)} away</strong> from free delivery.`
    : `<strong>You’ve unlocked free delivery!</strong> Your neighborhood treats are on us.`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function setCategory(category) {
  if (!products.some((product) => product.category === category)) {
    activeCategory = "";
    searchQuery = "";
    searchInput.value = "";
    renderProducts();
    showToast("More snacks are coming soon. Showing all available cuts.");
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
    return;
  }
  activeCategory = category;
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
}

function addToCart(id, amount = 1) {
  if (!getProduct(id)) {
    showToast("That item is no longer available.");
    return;
  }
  cart[id] = (cart[id] || 0) + amount;
  saveCart();
  renderProducts();
  renderCart();
  showToast(`${getProduct(id).name} added to your cart.`);
}

function changeQuantity(id, amount) {
  const nextQuantity = (cart[id] || 0) + amount;
  if (nextQuantity <= 0) {
    delete cart[id];
  } else {
    cart[id] = nextQuantity;
  }
  saveCart();
  renderProducts();
  renderCart();
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle("open", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  overlay.hidden = !isOpen;
  document.body.classList.toggle("drawer-open", isOpen);
  if (isOpen) {
    document.querySelector("#cart-close").focus();
  } else {
    document.querySelector("#cart-open").focus();
  }
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-to-cart]");
  if (button) {
    addToCart(button.dataset.addToCart);
  }
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-change-quantity]");
  if (button) {
    changeQuantity(button.dataset.changeQuantity, Number(button.dataset.amount));
  }
});

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchQuery = searchInput.value;
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderProducts();
});

sortSelect.addEventListener("change", renderProducts);

clearFilterButton.addEventListener("click", () => {
  activeCategory = "";
  searchQuery = "";
  searchInput.value = "";
  renderProducts();
});

document.querySelector("#reset-search").addEventListener("click", () => {
  activeCategory = "";
  searchQuery = "";
  searchInput.value = "";
  renderProducts();
});

document.querySelector("#category-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) {
    setCategory(button.dataset.category);
  }
});

document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => setCategory(link.dataset.categoryLink));
});

document.querySelector("#cart-open").addEventListener("click", () => setCartOpen(true));
document.querySelector("#cart-close").addEventListener("click", () => setCartOpen(false));
document.querySelector("#continue-shopping").addEventListener("click", () => setCartOpen(false));
overlay.addEventListener("click", () => setCartOpen(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
    setCartOpen(false);
  }
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  showToast("Checkout is a demo. Connect a payment and delivery service to accept orders.");
});

document.querySelector("#account-button").addEventListener("click", () => {
  showToast("Account sign-in can be connected when your store is ready.");
});

document.querySelector("#delivery-link").addEventListener("click", () => {
  const currentZip = localStorage.getItem(ZIP_STORAGE_KEY) || "";
  const zip = window.prompt("Enter your ZIP code to set your delivery area:", currentZip);
  if (zip === null) {
    return;
  }
  const normalizedZip = zip.trim();
  if (!/^\d{5}$/.test(normalizedZip)) {
    showToast("Please enter a valid 5-digit ZIP code.");
    return;
  }
  try {
    localStorage.setItem(ZIP_STORAGE_KEY, normalizedZip);
    deliveryZip.textContent = normalizedZip;
    showToast(`Delivery area set to ${normalizedZip}.`);
  } catch (error) {
    console.error("Unable to save the delivery area.", error);
    showToast("Your delivery area couldn’t be saved on this device.");
  }
});

const savedZip = localStorage.getItem(ZIP_STORAGE_KEY);
if (savedZip && /^\d{5}$/.test(savedZip)) {
  deliveryZip.textContent = savedZip;
}

const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

renderProducts();
renderCart();
