function shell(content, options = {}) {
  const active = options.active || "home";
  const loggedIn = typeof isLoggedIn === "function" && isLoggedIn();
  const navItems = loggedIn
    ? [
        ["首页", "#/", active === "home"],
        ["媒体资源", "#/media", active === "media"],
        ["网站合作入驻", "#/publisher", active === "publisher"],
      ]
    : [
        ["首页", "#/", active === "home"],
        ["媒体资源", "#/media", active === "media"],
        ["网站合作入驻", "#/publisher", active === "publisher"],
      ];

  return `
    <header class="topbar">
      <a class="brand" href="#/">
        <span class="brand-mark">H</span>
        <span>
          <strong>海媒通</strong>
          <small>海外媒体发稿平台</small>
        </span>
      </a>
      <nav class="nav">
        ${navItems.map(([label, href, isActive]) => navLink(label, href, isActive)).join("")}
      </nav>
      <div class="topbar-actions">
        ${loggedIn ? '<button class="button ghost nav-recharge" data-open-recharge><span>余额 $2,480</span><strong>充值</strong></button>' : ""}
        <a class="topbar-cta" href="${loggedIn ? "#/buyer" : "#/login"}">${loggedIn ? "用户中心" : "注册/登录"}</a>
      </div>
      <button class="menu-button" data-menu-button aria-label="打开导航">菜单</button>
    </header>
    <div class="mobile-nav" data-mobile-nav>
      ${navItems.map(([label, href, isActive]) => navLink(label, href, isActive)).join("")}
      ${loggedIn ? '<button class="button ghost" data-open-recharge>余额 $2,480 · 充值</button>' : ""}
      <a href="${loggedIn ? "#/buyer" : "#/login"}">${loggedIn ? "用户中心" : "注册/登录"}</a>
    </div>
    <main>${content}</main>
    ${loggedIn ? rechargeModal() : ""}
    <footer class="footer">
      <div>
        <strong>海媒通</strong>
        <p>面向中文用户的海外媒体发稿 MVP 原型，当前数据均为 mock。</p>
      </div>
      <div class="footer-links">
        <a href="#/media">媒体资源</a>
        <a href="#/publisher">网站合作入驻</a>
        ${loggedIn ? '<a href="#/admin">网站管理员后台</a>' : '<a href="#/login">注册/登录</a>'}
      </div>
    </footer>
  `;
}

function rechargeModal() {
  return `
    <div class="modal-backdrop" data-recharge-modal hidden>
      <div class="modal">
        <div class="section-head">
          <div>
            <p class="eyebrow">充值方式</p>
            <h2>选择充值渠道</h2>
          </div>
          <button class="mini-button subtle" data-close-recharge>关闭</button>
        </div>
        <div class="recharge-grid">
          <button data-create-deposit data-method="USDT" data-network="TRC20"><strong>USDT TRC20</strong><span>适合低手续费链上充值</span></button>
          <button data-create-deposit data-method="USDT" data-network="ERC20"><strong>USDT ERC20</strong><span>适合以太坊网络充值</span></button>
          <button data-create-deposit data-method="微信" data-network=""><strong>微信充值</strong><span>人民币人工入账</span></button>
          <button data-create-deposit data-method="支付宝" data-network=""><strong>支付宝充值</strong><span>人民币人工入账</span></button>
        </div>
        <p class="notice">MVP 阶段不接真实支付，真实版本会生成充值订单和收款信息。</p>
      </div>
    </div>
  `;
}

function navLink(label, href, active) {
  return `<a class="${active ? "active" : ""}" href="${href}">${label}</a>`;
}

function minSellerPrice(media) {
  return Math.min(...media.sellers.map((seller) => seller.price));
}

function primarySeller(media) {
  return media.sellers.reduce((lowest, seller) => (seller.price < lowest.price ? seller : lowest), media.sellers[0]);
}

function mediaCard(media) {
  const fromPrice = minSellerPrice(media);
  return `
    <article class="media-card">
      <div class="media-card-head">
        <div>
          <p class="eyebrow">${media.country} · ${media.language} · ${media.type}</p>
          <h3>${media.name}</h3>
          <p class="muted">${media.domain}</p>
        </div>
        <span class="price-badge">$${fromPrice}起</span>
      </div>
      <p>${media.description}</p>
      <div class="tag-row">
        <span>${media.category}</span>
        <span>${media.linkType === "Nofollow" ? "No follow" : "Do follow"}</span>
        <span>${media.indexed ? "包收录" : "不包收录"}</span>
      </div>
      <div class="card-action">
        <strong>DR ${media.dr} / DA ${media.da}</strong>
        <a class="button ghost" href="#/media/${media.id}">立即购买</a>
      </div>
    </article>
  `;
}

function metric(label, value) {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function mediaTable(items = mediaList) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>媒体</th>
            <th>国家</th>
            <th>行业</th>
            <th>语言</th>
            <th>DR/DA</th>
            <th>月流量</th>
            <th>谷歌收录</th>
            <th>Sponsored 标签</th>
            <th>最低报价</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${items.map(mediaTableRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function mediaTableRow(media) {
  const cheapest = primarySeller(media);
  const hasSponsored = media.sellers.some((seller) => seller.sponsored);
  return `
    <tr>
      <td>
        <strong>${media.name}</strong>
        <small>${media.domain}</small>
      </td>
      <td>${media.country}</td>
      <td>${media.category}</td>
      <td>${media.language}</td>
      <td>${media.dr}/${media.da}</td>
      <td>${media.trafficLabel}</td>
      <td>${media.indexed ? '<span class="status success">包收录</span>' : '<span class="status neutral">不包收录</span>'}</td>
      <td>${hasSponsored ? '<span class="status warning">有</span>' : '<span class="status neutral">无</span>'}</td>
      <td><strong>$${cheapest.price}起</strong></td>
      <td><a class="table-link" href="#/media/${media.id}">立即购买</a></td>
    </tr>
  `;
}

function orderStatus(status) {
  const tone = status.includes("完成") ? "success" : status.includes("待") ? "warning" : "info";
  return `<span class="status ${tone}">${status}</span>`;
}

function select(name, options, attrs = "") {
  return `
    <label>
      <span>${name}</span>
      <select ${attrs}>
        ${options.map((option) => `<option value="${option.value ?? option}">${option.label ?? option}</option>`).join("")}
      </select>
    </label>
  `;
}
