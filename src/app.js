const app = document.querySelector("#app");
const TOKEN_KEY = "haimeitong_api_token";
const USER_KEY = "haimeitong_api_user";
const MOCK_AUTH_KEY = "haimeitong_mock_login";
const apiMode = location.protocol.startsWith("http");

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return Boolean(getToken()) || localStorage.getItem(MOCK_AUTH_KEY) === "true";
}

function setLoggedIn(value, payload = {}) {
  if (value) {
    if (payload.token) localStorage.setItem(TOKEN_KEY, payload.token);
    if (payload.user) localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    localStorage.setItem(MOCK_AUTH_KEY, "true");
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(MOCK_AUTH_KEY);
  }
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
}

function getRoute() {
  const hash = window.location.hash || "#/";
  return hash.replace("#/", "").split("/").filter(Boolean);
}

async function syncBackendData() {
  if (!apiMode) return;
  try {
    const mediaResponse = await api("/api/media");
    if (Array.isArray(mediaResponse.items)) {
      mediaList.splice(0, mediaList.length, ...mediaResponse.items);
    }
  } catch {
    // file/static preview can continue using mock data.
  }

  if (isLoggedIn()) {
    try {
      const orderResponse = await api("/api/orders");
      if (Array.isArray(orderResponse.items)) {
        orders.splice(0, orders.length, ...orderResponse.items.map(normalizeOrder));
      }
    } catch {
      // Role may not have orders yet.
    }
  }
}

function normalizeOrder(order) {
  return {
    ...order,
    mediaName: order.mediaName || order.mediaId,
    project: order.brandName || order.project || "发稿订单",
    amount: order.amount || 0,
    eta: order.updatedAt ? order.updatedAt.slice(0, 10) : "待确认",
  };
}

async function render() {
  await syncBackendData();
  const [section, id, sellerId] = getRoute();
  let page = "";
  let active = "home";

  if (!section) {
    page = homePage();
    active = "home";
  } else if (section === "media" && id) {
    page = mediaDetailPage(id);
    active = "media";
  } else if (section === "media") {
    page = mediaListPage();
    active = "media";
  } else if (section === "order") {
    page = isLoggedIn() ? orderPage(id, sellerId) : loginPage();
    active = "media";
  } else if (section === "login") {
    page = loginPage();
    active = "login";
  } else if (section === "buyer" || section === "account") {
    page = isLoggedIn() ? buyerDashboardPage() : loginPage();
    active = "account";
  } else if (section === "seller" || section === "publisher-dashboard") {
    page = isLoggedIn() ? sellerDashboardPage() : loginPage();
    active = "admin";
  } else if (section === "admin") {
    page = isLoggedIn() ? siteAdminDashboardPage() : loginPage();
    active = "admin";
  } else if (section === "publisher") {
    page = publisherPage();
    active = "publisher";
  } else {
    page = homePage();
  }

  app.innerHTML = shell(page, { active });
  bindInteractions();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function bindInteractions() {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  menuButton?.addEventListener("click", () => mobileNav?.classList.toggle("open"));

  bindMediaFilters();
  bindAuth();
  bindRecharge();
  bindForms();
  bindEditor();
  bindActionModals();
}

function bindAuth() {
  document.querySelector("[data-login-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const [emailInput, passwordInput] = event.currentTarget.querySelectorAll("input");
    const email = emailInput?.value || "admin@example.com";
    const password = passwordInput?.value || "admin123";
    if (apiMode) {
      try {
        const result = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setLoggedIn(true, result);
      } catch (error) {
        alert(`登录失败：${error.message}`);
        return;
      }
    } else {
      setLoggedIn(true);
    }
    window.location.hash = "#/media";
  });

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    setLoggedIn(false);
    window.location.hash = "#/";
  });
}

function bindRecharge() {
  const rechargeModal = document.querySelector("[data-recharge-modal]");
  document.querySelectorAll("[data-open-recharge]").forEach((button) => {
    button.addEventListener("click", () => {
      if (rechargeModal) rechargeModal.hidden = false;
    });
  });
  document.querySelector("[data-close-recharge]")?.addEventListener("click", () => {
    if (rechargeModal) rechargeModal.hidden = true;
  });
  rechargeModal?.addEventListener("click", (event) => {
    if (event.target === rechargeModal) rechargeModal.hidden = true;
  });

  document.querySelectorAll("[data-create-deposit]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!apiMode) return alert("静态预览模式下不会保存充值单。请用 npm start 启动后端。");
      try {
        await api("/api/deposits", {
          method: "POST",
          body: JSON.stringify({
            method: button.dataset.method,
            network: button.dataset.network,
            amount: 1000,
          }),
        });
        alert("充值单已创建，请等待管理员确认入账。");
        if (rechargeModal) rechargeModal.hidden = true;
      } catch (error) {
        alert(`充值失败：${error.message}`);
      }
    });
  });
}

function bindForms() {
  document.querySelector("[data-order-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const [section, mediaId, sellerId] = getRoute();
    const inputs = event.currentTarget.querySelectorAll("input");
    const editor = document.querySelector("[data-editor]");
    if (apiMode) {
      try {
        await api("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            mediaId,
            sellerId,
            brandName: inputs[0]?.value || "未命名品牌",
            targetUrl: inputs[1]?.value || "",
            anchor: inputs[2]?.value || "",
            title: inputs[4]?.value || "未命名稿件",
            contentHtml: editor?.innerHTML || "",
            notes: event.currentTarget.querySelector("textarea")?.value || "",
          }),
        });
        alert("订单已提交，已保存到后端。");
      } catch (error) {
        alert(`提交订单失败：${error.message}`);
        return;
      }
    } else {
      alert("静态预览模式下不会保存订单。请用 npm start 启动后端。");
    }
    window.location.hash = "#/buyer";
  });

  document.querySelector("[data-publisher-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!apiMode) return alert("静态预览模式下不会保存媒体。请用 npm start 启动后端。");
    const inputs = event.currentTarget.querySelectorAll("input");
    try {
      await api("/api/media", {
        method: "POST",
        body: JSON.stringify({
          name: inputs[0]?.value || "New Media",
          domain: inputs[1]?.value || "",
          country: inputs[2]?.value || "",
          language: inputs[3]?.value || "",
          category: inputs[4]?.value || "",
          traffic: 0,
          dr: 0,
          da: 0,
          indexed: false,
          description: event.currentTarget.querySelector("textarea")?.value || "",
        }),
      });
      alert("媒体已提交审核，管理员通过后会展示到前台。");
    } catch (error) {
      alert(`提交失败：${error.message}`);
    }
  });

  document.querySelectorAll("[data-demo-action]").forEach((button) => {
    button.addEventListener("click", () => {
      alert("演示按钮。真实保存动作已接到专用表单按钮，例如充值、下单、提交报价、提交发布链接、修改订单状态。");
    });
  });
}

function bindActionModals() {
  const mappings = [
    ["[data-open-seller-form]", "[data-seller-form-modal]"],
    ["[data-open-publish-form]", "[data-publish-form-modal]"],
    ["[data-open-admin-status]", "[data-admin-status-modal]"],
  ];

  mappings.forEach(([triggerSelector, modalSelector]) => {
    const modal = document.querySelector(modalSelector);
    document.querySelectorAll(triggerSelector).forEach((trigger) => {
      trigger.addEventListener("click", () => {
        if (modal) modal.hidden = false;
      });
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal-backdrop");
      if (modal) modal.hidden = true;
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.hidden = true;
    });
  });

  document.querySelector("[data-submit-seller-quote]")?.addEventListener("click", submitSellerQuote);
  document.querySelector("[data-submit-publish-url]")?.addEventListener("click", submitPublishUrl);
  document.querySelector("[data-admin-save-status]")?.addEventListener("click", submitAdminStatus);
}

async function submitSellerQuote() {
  if (!apiMode) return alert("静态预览模式下不会保存报价。请用 npm start 启动后端。");
  const modal = document.querySelector("[data-seller-form-modal]");
  const inputs = modal.querySelectorAll("input");
  const selects = modal.querySelectorAll("select");
  const domain = inputs[0]?.value?.trim();
  const media = mediaList.find((item) => item.domain === domain || item.id === domain) || mediaList[0];
  try {
    await api(`/api/media/${media.id}/sellers`, {
      method: "POST",
      body: JSON.stringify({
        role: selects[0]?.value === "网站所有者" ? "Owner" : "Reseller",
        name: selects[0]?.value || "Reseller/代理商",
        price: Number(String(inputs[1]?.value || "0").replace(/[^\d.]/g, "")),
        delivery: inputs[2]?.value || "5-7天",
        linkType: selects[1]?.value === "No follow" ? "Nofollow" : "Dofollow",
        sponsored: selects[2]?.value === "是",
        indexed: false,
        note: modal.querySelector("textarea")?.value || "",
      }),
    });
    alert("报价已提交审核。");
    modal.hidden = true;
    render();
  } catch (error) {
    alert(`提交报价失败：${error.message}`);
  }
}

async function submitPublishUrl() {
  if (!apiMode) return alert("静态预览模式下不会保存发布链接。请用 npm start 启动后端。");
  const modal = document.querySelector("[data-publish-form-modal]");
  const orderId = modal.querySelector("[data-publish-order-id]")?.value?.trim();
  const publishUrl = modal.querySelector("[data-publish-url]")?.value?.trim();
  if (!orderId) return alert("请填写订单编号。");
  try {
    await api(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "published", publishUrl }),
    });
    alert("发布链接已提交，订单进入待验收。");
    modal.hidden = true;
    render();
  } catch (error) {
    alert(`提交发布链接失败：${error.message}`);
  }
}

async function submitAdminStatus() {
  if (!apiMode) return alert("静态预览模式下不会保存订单状态。请用 npm start 启动后端。");
  const modal = document.querySelector("[data-admin-status-modal]");
  const orderId = modal.querySelector("[data-admin-order-id]")?.value?.trim();
  const status = modal.querySelector("[data-admin-order-status]")?.value;
  if (!orderId) return alert("请填写订单编号。");
  try {
    await api(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    alert("订单状态已更新。");
    modal.hidden = true;
    render();
  } catch (error) {
    alert(`修改状态失败：${error.message}`);
  }
}

function bindEditor() {
  document.querySelectorAll("[data-editor-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const editor = document.querySelector("[data-editor]");
      if (!editor) return;
      const action = button.dataset.editorAction;
      if (["h1", "h2", "h3"].includes(action)) {
        editor.insertAdjacentHTML("beforeend", `<${action}>新${action.toUpperCase()}标题</${action}>`);
      }
      if (action === "link") {
        editor.insertAdjacentHTML("beforeend", '<p><a href="https://example.com" target="_blank">示例链接</a></p>');
      }
      if (action === "image") {
        editor.insertAdjacentHTML("beforeend", '<figure class="editor-image-placeholder">图片占位</figure>');
      }
      editor.focus();
    });
  });
}

function bindMediaFilters() {
  const tableTarget = document.querySelector("[data-media-table]");
  const search = document.querySelector("[data-media-search]");
  const filters = Array.from(document.querySelectorAll("[data-media-filter]"));

  if (!tableTarget || !isLoggedIn()) return;

  const update = () => {
    const keyword = (search?.value || "").trim().toLowerCase();
    const values = Object.fromEntries(filters.map((filter) => [filter.dataset.mediaFilter, filter.value]));

    const filtered = mediaList.filter((media) => {
      const textMatch = [media.name, media.domain, media.country, media.category, media.language].join(" ").toLowerCase().includes(keyword);
      const categoryMatch = !values.category || media.category === values.category;
      const languageMatch = !values.language || media.language === values.language;
      const trafficThreshold = Number(values.traffic || 0);
      const trafficMatch = !trafficThreshold || media.traffic >= trafficThreshold;
      const drMatch = !values.dr || media.dr >= Number(values.dr);
      const daMatch = !values.da || media.da >= Number(values.da);
      const indexedMatch = !values.indexed || String(media.indexed) === values.indexed || media.sellers.some((seller) => String(seller.indexed) === values.indexed);
      const linkMatch = !values.linkType || media.linkType === values.linkType || media.sellers.some((seller) => seller.linkType === values.linkType);
      const sponsoredMatch = !values.sponsored || media.sellers.some((seller) => String(seller.sponsored) === values.sponsored);
      return textMatch && categoryMatch && languageMatch && trafficMatch && drMatch && daMatch && indexedMatch && linkMatch && sponsoredMatch;
    });

    tableTarget.innerHTML = mediaTable(filtered);
  };

  search?.addEventListener("input", update);
  filters.forEach((filter) => filter.addEventListener("change", update));
}

window.addEventListener("hashchange", () => render());
render();
