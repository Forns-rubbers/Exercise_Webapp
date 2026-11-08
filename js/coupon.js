import { supabase } from "./supabase.js";

const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) location.replace("index.html");

const coupons = [
  {
    id: "gingkaew-10",
    name: "กิ่งแก้ว",
    description: "คูปองส่วนลด 10 %",
    Image: "../media/img/kingkaew.jpg",
  },
  {
    id: "hiwsahaay",
    name: "หิวสหาย",
    description: "รายละเอียด",
    Image: "../media/img/hiwsahaay.jpg",
  },
];
const list = document.querySelector("#couponList");
const modal = document.querySelector("#couponModal");
const detailName = document.querySelector("#detailName");
const detailDescription = document.querySelector("#detailDescription");
const redeemButton = document.querySelector("#redeemCoupon");
const redeemMessage = document.querySelector("#redeemMessage");
let activeCoupon = null;
const storageKey = (coupon) => `fitz-coupon-used:${user?.id}:${coupon.id}`;

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  activeCoupon = null;
}

function renderCoupons() {
  list.replaceChildren();
  for (const coupon of coupons) {
    const used = localStorage.getItem(storageKey(coupon)) === "true";
    const card = document.createElement("button");
    card.type = "button";
    card.className = `coupon-card${used ? " used" : ""}`;
    card.setAttribute(
      "aria-label",
      `${coupon.name}: ${coupon.description}${used ? " - ใช้แล้ว" : ""}`,
    );
    const imagePlaceholder = document.createElement("img");

    imagePlaceholder.className = "coupon-avatar";
    imagePlaceholder.src = coupon.image;
    imagePlaceholder.alt = `ร้าน${coupon.name}`;

    imagePlaceholder.onerror = () => {
      imagePlaceholder.style.display = "none";
    };
    const copy = document.createElement("span");
    copy.className = "coupon-copy";
    const name = document.createElement("span");
    name.className = "coupon-name";
    name.textContent = coupon.name;
    const description = document.createElement("span");
    description.className = "coupon-description";
    description.textContent = coupon.description;
    copy.append(name, description);
    if (used) {
      const tag = document.createElement("span");
      tag.className = "used-tag";
      tag.textContent = "ใช้แล้ว";
      copy.append(tag);
    }
    card.append(imagePlaceholder, copy);
    card.addEventListener("click", () => openCoupon(coupon));
    list.append(card);
  }
}

function openCoupon(coupon) {
  activeCoupon = coupon;
  detailName.textContent = coupon.name;
  detailDescription.textContent = coupon.description;
  redeemMessage.textContent = "";
  const used = localStorage.getItem(storageKey(coupon)) === "true";
  redeemButton.disabled = used;
  redeemButton.textContent = used ? "ใช้คูปองแล้ว" : "แลกคูปอง";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.querySelector("#closeCoupon").focus();
}

document.querySelector("#closeCoupon").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-coupon")) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});
redeemButton.addEventListener("click", () => {
  if (
    !activeCoupon ||
    localStorage.getItem(storageKey(activeCoupon)) === "true"
  )
    return;
  localStorage.setItem(storageKey(activeCoupon), "true");
  redeemButton.disabled = true;
  redeemButton.textContent = "ใช้คูปองแล้ว";
  redeemMessage.textContent = "บันทึกการใช้คูปองแล้ว";
  renderCoupons();
});

renderCoupons();
