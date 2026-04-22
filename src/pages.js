function categorySummary(limit = 4) {
  return Object.entries(
    mediaList.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function sellerMix(media) {
  const ownerCount = media.sellers.filter((seller) => seller.role === "Owner").length;
  return ownerCount ? "含网站所有者报价" : "仅代理/合作方报价";
}

function homePage() {
  const featured = mediaList.filter((item) => item.featured);
  const categoryCards = categorySummary();
  const fastTrack = [...mediaList]
    .sort((a, b) => minSellerPrice(a) - minSellerPrice(b))
    .slice(0, 3);
  return `
    <section class="hero hero--editorial">
      <div class="hero-copy">
        <p class="eyebrow">海外 SEO · PR 发稿 · 品牌曝光</p>
        <h1>把海外媒体投放，从“问价碰运气”变成可对比的采购系统</h1>
        <p class="lead">按国家、行业、语言和 SEO 指标筛选媒体网站，再对比同一网站下不同 Owner 与 Reseller 的报价、交付规则和链接属性，直接找到更稳的渠道和更低的成本。</p>
        <div class="hero-badges">
          <span>多卖家同站比价</span>
          <span>SEO 指标直观筛选</span>
          <span>下单到验收全流程跟踪</span>
        </div>
        <div class="hero-actions">
          <a class="button primary" href="#/media">发布你的第一篇文章</a>
          <a class="button secondary" href="#/publisher">网站合作伙伴入驻</a>
        </div>
        <div class="hero-mini-stats">
          <div><span>上线媒体</span><strong>${stats.mediaCount}</strong></div>
          <div><span>平均交付</span><strong>${stats.avgDelivery}</strong></div>
          <div><span>覆盖国家</span><strong>${stats.countries}</strong></div>
        </div>
      </div>
      <div class="hero-panel hero-panel--stack" aria-label="平台业务概览">
        <div class="panel-top">
          <span>GLOBAL BUYING DESK</span>
          <strong>适合出海品牌的投放视图</strong>
        </div>
        <div class="signal-card">
          <div>
            <span>本周热度最高</span>
            <strong>科技 / 金融 / Web3 出海稿件</strong>
          </div>
          <b>+18%</b>
        </div>
        <div class="market-board">
          <div class="board-row headline">
            <span>${featured[0]?.name || "NorthTech Daily"}</span><em>Owner / Reseller 多报价并存</em>
          </div>
          ${categoryCards
            .map(
              ([name, count]) => `
                <div class="board-row">
                  <span>${name}</span><em>${count} 个资源在售</em>
                </div>
              `
            )
            .join("")}
          <div class="board-chart" aria-hidden="true">
            <i style="height: 38%"></i><i style="height: 61%"></i><i style="height: 52%"></i>
            <i style="height: 74%"></i><i style="height: 68%"></i><i style="height: 86%"></i>
          </div>
        </div>
        <div class="quote-ladder">
          ${fastTrack
            .map(
              (item) => `
                <div>
                  <span>${item.name}</span>
                  <strong>$${minSellerPrice(item)} 起</strong>
                  <em>${sellerMix(item)}</em>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="mini-list">
          <span>媒体审核</span><strong>92%</strong>
          <span>订单跟踪</span><strong>在线</strong>
          <span>询价效率</span><strong>高于人工表格</strong>
        </div>
      </div>
    </section>

    <section class="stats">
      ${metric("媒体资源", stats.mediaCount)}
      ${metric("覆盖国家", stats.countries)}
      ${metric("平均发布", stats.avgDelivery)}
      ${metric("行业分类", stats.categories)}
    </section>

    <section class="section story-strip">
      <div class="section-head">
        <div>
          <p class="eyebrow">平台价值</p>
          <h2>不是媒体目录，而是面向采购的投放工作台</h2>
        </div>
      </div>
      <div class="insight-grid">
        <article>
          <span>01</span>
          <strong>同站多卖家报价</strong>
          <p>你能直接看到网站所有者和代理商的不同价格、链接属性、Sponsored 规则和交付周期。</p>
        </article>
        <article>
          <span>02</span>
          <strong>按投放条件筛站</strong>
          <p>从国家、语言、DR、DA、月流量、谷歌收录和 Do follow / No follow 等条件切入。</p>
        </article>
        <article>
          <span>03</span>
          <strong>从下单到验收闭环</strong>
          <p>订单、充值、交付链接和后台审核都在同一套界面里，适合继续做成真实 SaaS。</p>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">按赛道浏览</p>
          <h2>高频投放行业一屏看清</h2>
        </div>
      </div>
      <div class="category-grid">
        ${categoryCards
          .map(
            ([name, count], index) => `
              <article class="category-card">
                <span>0${index + 1}</span>
                <strong>${name}</strong>
                <p>${count} 个已上架资源，支持 Owner / Reseller 多报价视图。</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section featured-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">精选资源</p>
          <h2>适合海外曝光的媒体资源</h2>
        </div>
        <a class="text-link" href="#/media">查看全部</a>
      </div>
      <div class="featured-layout">
        <div class="card-grid">
          ${featured.map(mediaCard).join("")}
        </div>
        <aside class="content-block compare-card">
          <p class="eyebrow">采购提示</p>
          <h2>选择媒体时先看三件事</h2>
          <div class="todo-list">
            <div><span class="status success">价格</span><strong>同一个网站优先比较 Owner 与 Reseller 的真实差价</strong></div>
            <div><span class="status info">规则</span><strong>确认链接属性、Sponsored、是否包收录，不要只看单价</strong></div>
            <div><span class="status warning">时效</span><strong>急稿优先选编辑或加急渠道，品牌稿可选更低价方案</strong></div>
          </div>
          <a class="button ghost full" href="#/media">进入媒体市场</a>
        </aside>
      </div>
    </section>

    <section class="section split split-alt">
      <div>
        <p class="eyebrow">交易流程</p>
        <h2>一个网站，可以由网站所有者或 Reseller/代理商接单</h2>
        <p class="muted">平台作为撮合方展示网站所有者、合作编辑、SEO 专家和媒体代理的不同报价、链接属性、Sponsored 规则和交付周期。</p>
      </div>
      <div class="steps">
        ${["选择网站", "选择卖家", "提交稿件", "平台审核", "发布验收"]
          .map((step, index) => `<div><span>${index + 1}</span><strong>${step}</strong></div>`)
          .join("")}
      </div>
    </section>

    <section class="section cta-band">
      <div>
        <p class="eyebrow">准备继续完善这个项目</p>
        <h2>当前这套前端已经具备继续接入真实账号、订单和支付的基础页面结构</h2>
      </div>
      <a class="button primary" href="#/admin">查看后台结构</a>
    </section>
  `;
}

function mediaListPage() {
  const loggedIn = isLoggedIn();
  const visibleItems = loggedIn ? mediaList.slice(0, 20) : mediaList.slice(0, 20);
  const disabled = loggedIn ? "" : "disabled";
  const lowestPrice = Math.min(...mediaList.map((item) => minSellerPrice(item)));
  const ownerReady = mediaList.filter((item) => item.sellers.some((seller) => seller.role === "Owner")).length;
  const indexedReady = mediaList.filter((item) => item.indexed || item.sellers.some((seller) => seller.indexed)).length;

  return `
    <section class="page-title">
      <p class="eyebrow">媒体资源市场</p>
      <h1>按投放条件筛选海外媒体网站</h1>
      <p class="muted">先看网站本身，再进入详情页比较该网站下不同 Owner 与 Reseller 的报价、交付周期和链接规则。</p>
    </section>

    <section class="market-summary">
      <article><span>可比价媒体</span><strong>${mediaList.length}</strong><em>当前 mock 数据已支持完整筛选逻辑</em></article>
      <article><span>最低起价</span><strong>$${lowestPrice}</strong><em>适合先做预算试投</em></article>
      <article><span>含 Owner 报价</span><strong>${ownerReady}</strong><em>优先查看网站所有者直连资源</em></article>
      <article><span>可做收录承诺</span><strong>${indexedReady}</strong><em>含媒体本身或卖家承诺收录</em></article>
    </section>

    ${
      loggedIn
        ? ""
        : `<section class="gate-banner">
            <div>
              <strong>未登录仅可预览第一页资源</strong>
              <p>注册/登录后可查看全部媒体，并使用流量、DR、DA、收录和链接属性筛选器。</p>
            </div>
            <a class="button primary" href="#/login">注册/登录解锁全部</a>
          </section>`
    }

    <section class="filters ${loggedIn ? "" : "is-locked"}">
      <label class="search-field">
        <span>搜索</span>
        <input type="search" placeholder="输入国家、行业、媒体名称" data-media-search ${disabled} />
      </label>
      ${select("行业", [{ label: "全部", value: "" }, "金融媒体", "科技媒体", "区块链媒体", "多产业垂直媒体"], `data-media-filter="category" ${disabled}`)}
      ${select("语言", [{ label: "全部", value: "" }, "英文", "中文"], `data-media-filter="language" ${disabled}`)}
      ${select("月流量", [{ label: "全部", value: "" }, { label: "5万+", value: "50000" }, { label: "10万+", value: "100000" }, { label: "20万+", value: "200000" }, { label: "30万+", value: "300000" }], `data-media-filter="traffic" ${disabled}`)}
      ${select("DR", [{ label: "全部", value: "" }, { label: "DR 40+", value: "40" }, { label: "DR 50+", value: "50" }, { label: "DR 60+", value: "60" }], `data-media-filter="dr" ${disabled}`)}
      ${select("DA", [{ label: "全部", value: "" }, { label: "DA 40+", value: "40" }, { label: "DA 50+", value: "50" }, { label: "DA 60+", value: "60" }], `data-media-filter="da" ${disabled}`)}
      ${select("是否包谷歌收录", [{ label: "全部", value: "" }, { label: "是", value: "true" }, { label: "否", value: "false" }], `data-media-filter="indexed" ${disabled}`)}
      ${select("链接属性", [{ label: "全部", value: "" }, { label: "Do follow", value: "Dofollow" }, { label: "No follow", value: "Nofollow" }], `data-media-filter="linkType" ${disabled}`)}
      ${select("Sponsored", [{ label: "全部", value: "" }, { label: "是", value: "true" }, { label: "否", value: "false" }], `data-media-filter="sponsored" ${disabled}`)}
    </section>

    <section class="section no-top">
      <div class="section-head">
        <div>
          <h2>媒体列表</h2>
          <p class="muted">${loggedIn ? "已解锁完整筛选。建议先筛国家 / 行业，再比较是否含网站所有者直连报价。" : "当前为未登录预览模式，仅展示第一页资源。"}</p>
        </div>
      </div>
      <div data-media-table>${mediaTable(visibleItems)}</div>
      <div class="pagination">
        <button class="mini-button subtle" disabled>上一页</button>
        <span>第 1 页 / 共 ${loggedIn ? Math.ceil(mediaList.length / 20) : 1} 页</span>
        <button class="mini-button subtle" ${loggedIn && mediaList.length > 20 ? "" : "disabled"}>下一页</button>
      </div>
    </section>
  `;
}

function mediaDetailPage(id) {
  const media = mediaList.find((item) => item.id === id) || mediaList[0];
  const ownerSeller = media.sellers.find((seller) => seller.role === "Owner");
  return `
    <section class="media-buy-header">
      <div class="buy-title-row">
        <div>
          <p class="eyebrow">${media.category}</p>
          <h1>${media.domain}</h1>
          <div class="tag-row">
            <span>${media.country}</span>
            <span>${media.language}</span>
            <span>${media.linkType === "Nofollow" ? "No follow" : "Do follow"}</span>
            <span>${media.indexed ? "包收录" : "不包收录"}</span>
          </div>
        </div>
        <a class="button ghost" href="#/media">返回媒体列表</a>
      </div>
      <div class="site-metrics-grid">
        <div><span>内容发布起价</span><strong>$${minSellerPrice(media)}</strong></div>
        <div><span>Ahrefs Organic Traffic</span><strong>${media.trafficLabel}</strong></div>
        <div><span>Moz DA</span><strong>${media.da}</strong></div>
        <div><span>Ahrefs DR</span><strong>${media.dr}</strong></div>
        <div><span>Language</span><strong>${media.language}</strong></div>
        <div><span>Country</span><strong>${media.country}</strong></div>
        <div><span>Link attribution type</span><strong>${media.linkType === "Nofollow" ? "No follow" : "Do follow"}</strong></div>
        <div><span>Indexing</span><strong>${media.indexed ? "包收录" : "不包收录"}</strong></div>
      </div>
    </section>

    <section class="detail-grid media-detail-grid">
      <article class="content-block wide detail-overview-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">媒体概览</p>
            <h2>${media.name}</h2>
          </div>
          <span class="status ${ownerSeller ? "success" : "info"}">${ownerSeller ? "含网站所有者直连报价" : "仅代理报价"}</span>
        </div>
        <p>${media.description}</p>
        <div class="detail-chip-grid">
          <div><span>最低报价</span><strong>$${minSellerPrice(media)}</strong></div>
          <div><span>卖家数量</span><strong>${media.sellers.length}</strong></div>
          <div><span>推荐交付</span><strong>${media.delivery}</strong></div>
          <div><span>适合场景</span><strong>${media.type}</strong></div>
        </div>
      </article>
      <article class="content-block">
        <p class="eyebrow">适合发布</p>
        <h2>接稿范围</h2>
        <div class="tag-row">
          ${media.accepts.map((item) => `<span>${item}</span>`).join("")}
        </div>
        <h3>不接受内容</h3>
        <div class="tag-row warning-tags">
          ${media.rejects.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </article>
      <article class="content-block">
        <p class="eyebrow">投稿要求</p>
        <h2>编辑规则</h2>
        <p>${media.requirements}</p>
        <h3>适合选题</h3>
        <div class="channel-list">
          ${media.examples.map((example) => `<div class="channel-row"><strong>${example}</strong><span>适合品牌稿或新闻稿切入</span></div>`).join("")}
        </div>
      </article>
    </section>

    <section class="performer-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Owner / Reseller 报价</p>
          <h2>选择适合你的发布服务商</h2>
          <p class="muted">同一个网站可能由网站所有者直接接单，也可能由合作编辑、SEO 专家或媒体代理 Reseller/代理商接单。</p>
        </div>
      </div>
      <div class="performer-list">
          ${media.sellers
            .map(
              (seller) => `
                <article class="performer-card ${seller.role === "Owner" ? "is-owner" : ""}">
                  <div class="performer-main">
                    <h3>${seller.name}</h3>
                    <p>${seller.note}</p>
                    <div class="tag-row"><span>${seller.role === "Owner" ? "网站所有者" : "Reseller/代理商"}</span></div>
                  </div>
                  <div class="performer-data">
                    <div><span>Content placement</span><strong>$${seller.price}</strong></div>
                    <div><span>Turn around time</span><strong>${seller.delivery}</strong></div>
                    <div><span>Links</span><strong>${seller.linkType === "Nofollow" ? "No follow" : "Do follow"}</strong></div>
                    <div><span>Sponsored</span><strong>${seller.sponsored ? "Yes" : "No"}</strong></div>
                    <div><span>Indexing</span><strong>${seller.indexed ? "包收录" : "不包收录"}</strong></div>
                    <div><span>Max links</span><strong>2</strong></div>
                    <div><span>Min words</span><strong>500 words</strong></div>
                  </div>
                  <div class="performer-actions">
                    <button class="mini-button subtle" data-demo-action>收藏</button>
                    <a class="button primary" href="#/order/${media.id}/${seller.id}">Buy Now</a>
                  </div>
                </article>
              `
            )
            .join("")}
      </div>
    </section>
  `;
}

function orderPage(id, sellerId) {
  const media = mediaList.find((item) => item.id === id) || mediaList[0];
  const seller = media.sellers.find((item) => item.id === sellerId) || primarySeller(media);
  return `
    <section class="page-title">
      <p class="eyebrow">创建订单</p>
      <h1>提交发稿需求</h1>
      <p class="muted">你正在通过「${seller.name}」购买 ${media.name} 的发布服务。该卖家身份：${seller.role === "Owner" ? "网站所有者" : "Reseller/代理商"}。</p>
    </section>

    <section class="form-layout">
      <form class="form-card" data-order-form>
        <h2>项目与稿件信息</h2>
        <div class="form-grid">
          <label><span>品牌 / 公司名称</span><input required placeholder="例如：某 AI SaaS 公司" /></label>
          <label><span>目标网站</span><input required placeholder="https://example.com" /></label>
          <label><span>锚文本</span><input placeholder="英文锚文本或品牌名" /></label>
          <label><span>服务类型</span><input value="自备稿件" readonly /></label>
        </div>
        <label><span>文章标题</span><input placeholder="请输入英文或中文稿件标题" /></label>
        <div class="editor-wrap">
          <span>正文编辑器</span>
          <div class="editor-toolbar">
            <button type="button" data-editor-action="h1">H1</button>
            <button type="button" data-editor-action="h2">H2</button>
            <button type="button" data-editor-action="h3">H3</button>
            <button type="button" data-editor-action="link">插入链接</button>
            <button type="button" data-editor-action="image">插入图片</button>
          </div>
          <div class="mock-editor" contenteditable="true" data-editor>
            <h2>请在这里粘贴或编辑你的自备稿件</h2>
            <p>支持设置 H1 / H2 / H3 标题、插入链接和图片占位。当前为前端原型编辑器。</p>
          </div>
        </div>
        <label><span>补充备注</span><textarea rows="4" placeholder="例如：可接受编辑调整标题，不接受敏感表达等"></textarea></label>
        <button class="button primary" type="submit">提交模拟订单</button>
      </form>

      <aside class="summary-card">
        <h2>订单摘要</h2>
        <div class="summary-media">
          <strong>${media.name}</strong>
          <span>${media.country} · ${media.category}</span>
        </div>
        <div class="info-list">
          <div><span>卖家</span><strong>${seller.name}</strong></div>
          <div><span>卖家身份</span><strong>${seller.role === "Owner" ? "网站所有者" : "Reseller/代理商"}</strong></div>
          <div><span>发布价格</span><strong>$${seller.price}</strong></div>
          <div><span>链接属性</span><strong>${seller.linkType === "Nofollow" ? "No follow" : "Do follow"}</strong></div>
          <div><span>Sponsored</span><strong>${seller.sponsored ? "Yes" : "No"}</strong></div>
          <div><span>收录承诺</span><strong>${seller.indexed ? "包收录" : "不包收录"}</strong></div>
          <div><span>预计交付</span><strong>${seller.delivery}</strong></div>
        </div>
        <p class="notice">MVP 阶段仅生成模拟订单，真实版本会进入支付托管和平台审核流程。</p>
      </aside>
    </section>
  `;
}

function loginPage() {
  return `
    <section class="login-shell">
      <div class="login-intro">
        <p class="eyebrow">账号入口</p>
        <h1>注册 / 登录后解锁完整媒体库与后台视图</h1>
        <p class="muted">当前是 MVP 阶段演示登录。进入后可查看完整媒体筛选、买家后台、卖家后台和管理员后台结构。</p>
        <div class="todo-list">
          <div><span class="status success">Buyer</span><strong>查看订单、余额与稿件验收</strong></div>
          <div><span class="status info">Seller</span><strong>提交媒体报价、处理接单与交付</strong></div>
          <div><span class="status warning">Admin</span><strong>审核媒体、充值与订单状态</strong></div>
        </div>
      </div>
      <div class="login-panel">
        <form class="form-card login-card" data-login-form>
          <p class="eyebrow">账号演示</p>
          <h2>输入账号密码</h2>
          <label><span>邮箱</span><input type="email" placeholder="name@example.com" /></label>
          <label><span>密码</span><input type="password" placeholder="请输入密码" /></label>
          <button class="button primary" type="submit">登录进入系统</button>
        </form>
        <aside class="content-block demo-account-card">
          <p class="eyebrow">快速填充</p>
          <h2>演示账号</h2>
          <div class="demo-account-list">
            <button class="mini-button" type="button" data-demo-login data-email="buyer@example.com" data-password="buyer123">买家账号</button>
            <button class="mini-button" type="button" data-demo-login data-email="seller@example.com" data-password="seller123">卖家账号</button>
            <button class="mini-button" type="button" data-demo-login data-email="admin@example.com" data-password="admin123">管理员账号</button>
          </div>
          <p class="muted">点击后会自动填充表单。静态模式下同样可直接进入前端原型。</p>
        </aside>
      </div>
    </section>
  `;
}

function dashboardSidebar(active) {
  return `
    <aside class="sidebar">
      <strong>后台中心</strong>
      <a class="${active === "buyer" ? "active" : ""}" href="#/buyer">买家后台</a>
      <a class="${active === "seller" ? "active" : ""}" href="#/seller">卖家后台</a>
      <a class="${active === "admin" ? "active" : ""}" href="#/admin">网站管理员</a>
      <a href="#/media">媒体资源</a>
      <button class="mini-button subtle" data-logout>退出登录</button>
    </aside>
  `;
}

function buyerDashboardPage() {
  return `
    <section class="dashboard">
      ${dashboardSidebar("buyer")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Buyer Console</p>
          <h1>买家后台</h1>
          <p class="muted">用于发稿客户管理余额、订单、稿件和售后。</p>
        </div>
        <div class="stats">
          ${metric("总订单", orders.length)}
          ${metric("进行中", 2)}
          ${metric("已完成", 1)}
          ${metric("模拟余额", "$2,480")}
        </div>
        <section class="wallet-panel">
          <div>
            <p class="eyebrow">账户余额</p>
            <h2>$2,480</h2>
            <p class="muted">支持 USDT 与人民币充值方式，当前为前端原型演示。</p>
          </div>
          <button class="button primary" data-open-recharge>充值</button>
        </section>
        <section class="content-block">
          <div class="section-head">
            <div>
              <h2>最近订单</h2>
              <p class="muted">买家可以跟踪付款、卖家接单、发布、验收和售后状态。</p>
            </div>
            <a class="button ghost" href="#/media">创建新订单</a>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>订单编号</th><th>媒体</th><th>项目</th><th>金额</th><th>状态</th><th>预计交付</th><th>操作</th></tr></thead>
              <tbody>
                ${orders
                  .map((order, index) => `<tr><td><strong>${order.id}</strong></td><td>${order.mediaName}</td><td>${order.project}</td><td>$${order.amount}</td><td>${orderStatus(order.status)}</td><td>${order.eta}</td><td><button class="mini-button" data-demo-action>${index === 1 ? "确认验收" : "查看详情"}</button><button class="mini-button subtle" data-demo-action>申请修改</button></td></tr>`)
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
        <section class="admin-grid">
          <article class="content-block">
            <h2>待处理事项</h2>
            <div class="todo-list">
              <div><span class="status warning">待验收</span><strong>1 个订单已发布，等待确认</strong></div>
              <div><span class="status info">稿件</span><strong>2 篇自备稿件待补充图片</strong></div>
              <div><span class="status neutral">余额</span><strong>余额充足，可继续下单</strong></div>
            </div>
          </article>
          <article class="content-block">
            <h2>常用入口</h2>
            <div class="workspace-actions single">
              <a class="action-tile" href="#/media"><span>发稿</span><strong>选择媒体网站</strong></a>
              <a class="action-tile" href="#/buyer"><span>财务</span><strong>充值与余额</strong></a>
            </div>
          </article>
        </section>
        <section class="workspace-actions">
          <a class="action-tile" href="#/media"><span>继续选媒体</span><strong>进入媒体市场</strong></a>
          <a class="action-tile" href="#/seller"><span>切换身份</span><strong>查看卖家后台</strong></a>
          <a class="action-tile" href="#/admin"><span>运营视角</span><strong>进入网站管理员后台</strong></a>
        </section>
      </div>
    </section>
  `;
}

function publisherPage() {
  return `
    <section class="page-title">
      <p class="eyebrow">网站合作入驻</p>
      <h1>提交你的海外媒体资源，成为平台合作伙伴</h1>
      <p class="muted">适合海外站长、垂直媒体、博客 owner、媒体代理和 SEO 服务商。</p>
    </section>

    <section class="split publisher-intro">
      <div>
        <h2>入驻后你可以获得</h2>
        <div class="benefit-grid">
          <div><strong>稳定订单来源</strong><p>面向中国出海客户展示媒体资源。</p></div>
          <div><strong>多卖家报价展示</strong><p>同一网站可展示 Owner 与 Reseller 的不同报价与交付规则。</p></div>
          <div><strong>平台协助履约</strong><p>平台处理需求整理、订单跟踪和售后沟通。</p></div>
        </div>
      </div>
      <form class="form-card" data-publisher-form>
        <h2>提交媒体资源</h2>
        <div class="form-grid">
          <label><span>网站名称</span><input required placeholder="例如：Global Tech Review" /></label>
          <label><span>网站域名</span><input required placeholder="https://example.com" /></label>
          <label><span>国家 / 地区</span><input placeholder="例如：美国" /></label>
          <label><span>主要语言</span><input placeholder="例如：英文" /></label>
          <label><span>行业分类</span><input placeholder="例如：科技媒体、金融媒体" /></label>
          <label><span>最低发布价格</span><input placeholder="例如：500 USD 起" /></label>
        </div>
        <label><span>卖家身份和内容规则</span><textarea rows="5" placeholder="请说明你是网站所有者还是 Reseller/代理商，以及可接行业、Sponsored、链接属性、是否包谷歌收录、报价等"></textarea></label>
        <button class="button primary" type="submit">提交审核</button>
      </form>
    </section>
  `;
}

function sellerDashboardPage() {
  return `
    <section class="dashboard">
      ${dashboardSidebar("seller")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Seller Console</p>
          <h1>卖家后台</h1>
          <p class="muted">卖家可以是网站所有者，也可以是 Reseller/代理商，用于管理媒体、报价、接单与结算。</p>
        </div>
        <div class="stats">
          ${metric("我的媒体", mediaList.length)}
          ${metric("卖家报价", mediaList.reduce((sum, item) => sum + item.sellers.length, 0))}
          ${metric("待接单", 3)}
          ${metric("待结算", "$1,240")}
        </div>
        <section class="content-block">
          <div class="section-head">
            <div>
              <h2>我的媒体与报价</h2>
              <p class="muted">卖家可提交网站，也可提交自己拥有合作关系的网站报价。网站管理员审核后展示到前台。</p>
            </div>
            <button class="button ghost" data-open-seller-form>新增媒体/报价</button>
          </div>
          ${mediaTable(mediaList.slice(0, 5))}
        </section>
        <section class="content-block">
          <div class="section-head"><div><h2>收到的订单</h2><p class="muted">卖家处理接单、提交发布链接、修改稿件和结算。</p></div></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>订单</th><th>媒体</th><th>买家项目</th><th>卖家身份</th><th>状态</th><th>收入</th><th>操作</th></tr></thead>
              <tbody>
                ${orders
                  .map((order, index) => `<tr><td><strong>${order.id}</strong></td><td>${order.mediaName}</td><td>${order.project}</td><td>${index === 1 ? "Reseller/代理商" : "网站所有者"}</td><td>${orderStatus(index === 0 ? "待接单" : order.status)}</td><td>$${Math.round(order.amount * 0.78)}</td><td><button class="mini-button" data-demo-action>接单</button><button class="mini-button subtle" data-demo-action>拒单</button><button class="mini-button subtle" data-open-publish-form>提交链接</button></td></tr>`)
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
        <section class="admin-grid">
          <article class="content-block">
            <h2>报价规则</h2>
            <div class="todo-list">
              <div><span class="status success">Owner</span><strong>网站所有者直接接单会在购买页高亮推荐</strong></div>
              <div><span class="status info">Reseller</span><strong>代理商报价需说明合作关系和交付规则</strong></div>
              <div><span class="status warning">Sponsored</span><strong>如带 Sponsored 标签需在报价中明确</strong></div>
            </div>
          </article>
          <article class="content-block">
            <h2>结算概览</h2>
            <div class="info-list">
              <div><span>可结算</span><strong>$1,240</strong></div>
              <div><span>结算中</span><strong>$680</strong></div>
              <div><span>平台服务费</span><strong>20%</strong></div>
            </div>
          </article>
        </section>
      </div>
    </section>
    ${sellerActionModals()}
  `;
}

function siteAdminDashboardPage() {
  return `
    <section class="dashboard admin-dashboard">
      ${dashboardSidebar("admin")}
      <div class="dashboard-main">
        <div class="page-title compact-title">
          <p class="eyebrow">Admin Workspace</p>
          <h1>网站管理员后台</h1>
          <p class="muted">平台方管理用户、媒体、卖家报价、订单履约、充值入账和风险审核。</p>
        </div>
        <div class="stats">
          ${metric("待审核媒体", 4)}
          ${metric("待审核报价", 6)}
          ${metric("进行中订单", 8)}
          ${metric("异常提醒", 3)}
        </div>
        <section class="admin-grid">
          <article class="content-block">
            <h2>运营待办</h2>
            <div class="todo-list">
              <div><span class="status warning">待审核</span><strong>4 个媒体资源等待审核</strong></div>
              <div><span class="status info">卖家</span><strong>6 个 Owner/Reseller 报价需要复核</strong></div>
              <div><span class="status warning">风险</span><strong>1 个金融类订单需要人工复核</strong></div>
              <div><span class="status success">结算</span><strong>本周可结算媒体主 $3,420</strong></div>
            </div>
          </article>
          <article class="content-block">
            <h2>平台交易趋势</h2>
            <div class="admin-chart" aria-hidden="true">
              <i style="height: 34%"></i><i style="height: 58%"></i><i style="height: 46%"></i>
              <i style="height: 72%"></i><i style="height: 64%"></i><i style="height: 86%"></i>
            </div>
          </article>
        </section>
        <section class="content-block">
          <div class="section-head"><div><h2>媒体与卖家审核</h2><p class="muted">管理员可查看每个媒体下不同 Owner/Reseller 的报价。</p></div></div>
          ${mediaTable(mediaList)}
          <div class="admin-action-row">
            <button class="button primary" data-demo-action>审核通过选中媒体</button>
            <button class="button ghost" data-demo-action>驳回并要求修改</button>
            <button class="button ghost" data-open-admin-status>修改订单状态</button>
          </div>
        </section>
        <section class="content-block">
          <div class="section-head"><div><h2>资金与充值审核</h2><p class="muted">MVP 展示充值方式与人工入账流程，真实版本需对接支付或链上监听。</p></div></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>充值单</th><th>用户</th><th>方式</th><th>金额</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                <tr><td><strong>DEP-001</strong></td><td>上海某 SaaS</td><td>USDT TRC20</td><td>$1,000</td><td>${orderStatus("待确认")}</td><td><button class="mini-button" data-demo-action>确认入账</button><button class="mini-button subtle" data-demo-action>驳回</button></td></tr>
                <tr><td><strong>DEP-002</strong></td><td>深圳跨境品牌</td><td>支付宝</td><td>¥5,000</td><td>${orderStatus("已完成")}</td><td><button class="mini-button subtle" data-demo-action>查看</button></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
    ${adminActionModal()}
  `;
}

function sellerActionModals() {
  return `
    <div class="modal-backdrop" data-seller-form-modal hidden>
      <div class="modal">
        <div class="section-head">
          <div><p class="eyebrow">卖家操作</p><h2>新增媒体或报价</h2></div>
          <button class="mini-button subtle" data-close-modal>关闭</button>
        </div>
        <div class="form-grid">
          <label><span>网站域名</span><input placeholder="填写已有媒体域名，例如 northtechdaily.com" /></label>
          <label><span>卖家身份</span><select><option>网站所有者</option><option>Reseller/代理商</option></select></label>
          <label><span>报价</span><input placeholder="590 USD" /></label>
          <label><span>交付周期</span><input placeholder="5-7天" /></label>
          <label><span>链接属性</span><select><option>Do follow</option><option>No follow</option></select></label>
          <label><span>Sponsored 标签</span><select><option>否</option><option>是</option></select></label>
        </div>
        <label><span>合作说明</span><textarea rows="4" placeholder="说明你与该网站的合作关系、交付规则和限制行业"></textarea></label>
        <button class="button primary" data-submit-seller-quote>提交审核</button>
      </div>
    </div>
    <div class="modal-backdrop" data-publish-form-modal hidden>
      <div class="modal">
        <div class="section-head">
          <div><p class="eyebrow">订单交付</p><h2>提交发布链接</h2></div>
          <button class="mini-button subtle" data-close-modal>关闭</button>
        </div>
        <label><span>订单编号</span><input placeholder="ORD-20260420-001" data-publish-order-id /></label>
        <label><span>发布链接</span><input placeholder="https://media.com/article-url" data-publish-url /></label>
        <label><span>交付备注</span><textarea rows="4" placeholder="说明发布时间、是否已收录、是否可修改等"></textarea></label>
        <button class="button primary" data-submit-publish-url>提交给买家验收</button>
      </div>
    </div>
  `;
}

function adminActionModal() {
  return `
    <div class="modal-backdrop" data-admin-status-modal hidden>
      <div class="modal">
        <div class="section-head">
          <div><p class="eyebrow">管理员操作</p><h2>修改订单状态</h2></div>
          <button class="mini-button subtle" data-close-modal>关闭</button>
        </div>
        <div class="form-grid">
          <label><span>订单编号</span><input placeholder="ORD-20260420-001" data-admin-order-id /></label>
          <label><span>订单状态</span><select data-admin-order-status><option value="pending_payment">待付款</option><option value="paid">已付款</option><option value="accepted">卖家已接单</option><option value="publishing">发布中</option><option value="published">已发布待验收</option><option value="completed">已完成</option><option value="refund_requested">售后中</option></select></label>
        </div>
        <label><span>管理员备注</span><textarea rows="4" placeholder="记录修改原因，方便后续审计"></textarea></label>
        <button class="button primary" data-admin-save-status>保存状态</button>
      </div>
    </div>
  `;
}
