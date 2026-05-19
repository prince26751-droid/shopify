// Countdown timer — reads duration from data attributes on .countdown-box
(function () {
  var box = document.querySelector('.countdown-box[data-days]');
  if (!box) return;
  var d = parseInt(box.dataset.days) || 2;
  var h = parseInt(box.dataset.hours) || 14;
  var m = parseInt(box.dataset.mins) || 38;
  var end = new Date().getTime() + (d * 24 * 60 * 60 * 1000) + (h * 60 * 60 * 1000) + (m * 60 * 1000);
  function update() {
    var now = new Date().getTime();
    var diff = end - now;
    if (diff < 0) return;
    var rd = Math.floor(diff / (1000 * 60 * 60 * 24));
    var rh = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var rm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var rs = Math.floor((diff % (1000 * 60)) / 1000);
    var el;
    if ((el = document.getElementById('days'))) el.textContent = String(rd).padStart(2, '0');
    if ((el = document.getElementById('hours'))) el.textContent = String(rh).padStart(2, '0');
    if ((el = document.getElementById('mins'))) el.textContent = String(rm).padStart(2, '0');
    if ((el = document.getElementById('secs'))) el.textContent = String(rs).padStart(2, '0');
  }
  setInterval(update, 1000);
  update();
})();

// Pack selector
var selectedPack = 3;
function selectPack(n) {
  selectedPack = n;
  var p1 = document.getElementById('pack1');
  var p3 = document.getElementById('pack3');
  if (p1) p1.classList.toggle('selected', n === 1);
  if (p3) p3.classList.toggle('selected', n === 3);
  var label = n === 1 ? 'VedaBox Diabetic Care — 1 Bottle (30-Day Supply)' : 'VedaBox Diabetic Care — 3 Bottles (90-Day Supply)';
  var price = n === 1 ? '₹500' : '₹1,350';
  var s1 = document.getElementById('osSummary'); if (s1) s1.textContent = label;
  var op = document.getElementById('osPrice'); if (op) op.textContent = price;
}

// Step 1 → Step 2
function goToStep2() {
  var email = (document.getElementById('email') || {}).value || '';
  var phone = (document.getElementById('phone') || {}).value || '';
  var fname = (document.getElementById('fname') || {}).value || '';
  if (!fname.trim() || !email.trim() || !phone.trim()) {
    alert('Please fill in your name, email, and phone number to continue.');
    return;
  }
  var label = selectedPack === 1 ? 'VedaBox Diabetic Care × 1' : 'VedaBox Diabetic Care × 3';
  var price = selectedPack === 1 ? '₹500' : '₹1,350';
  var els = {
    osSummary2: selectedPack === 1 ? 'VedaBox Diabetic Care — 1 Bottle' : 'VedaBox Diabetic Care — 3 Bottles (90-Day Supply)',
    osPrice2: price,
    totalLabel: label,
    totalAmt: price,
    grandTotal: price
  };
  Object.keys(els).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = els[id];
  });
  document.getElementById('panel1').classList.remove('visible');
  document.getElementById('panel2').classList.add('visible');
  var s1tab = document.getElementById('step1tab');
  var s2tab = document.getElementById('step2tab');
  s1tab.classList.remove('active');
  s1tab.classList.add('done');
  s1tab.querySelector('.step-dot').textContent = '✓';
  s2tab.classList.add('active');
  var ck = document.getElementById('checkout');
  if (ck) ck.scrollIntoView({ behavior: 'smooth' });
}

function goBack() {
  document.getElementById('panel2').classList.remove('visible');
  document.getElementById('panel1').classList.add('visible');
  var s1tab = document.getElementById('step1tab');
  var s2tab = document.getElementById('step2tab');
  s2tab.classList.remove('active');
  s1tab.classList.remove('done');
  s1tab.classList.add('active');
  s1tab.querySelector('.step-dot').textContent = '1';
}

// Place order → thank you
function placeOrder() {
  var addr = (document.getElementById('addr1') || {}).value || '';
  var city = (document.getElementById('city') || {}).value || '';
  var pin  = (document.getElementById('pincode') || {}).value || '';
  if (!addr.trim() || !city.trim() || !pin.trim()) {
    alert('Please complete your delivery address.');
    return;
  }
  document.getElementById('panel2').classList.remove('visible');
  var ty = document.getElementById('thankYouPage');
  ty.classList.add('visible');
  var packLabel = selectedPack === 1 ? '1 Bottle — 30-Day Supply' : '3 Bottles — 90-Day Supply';
  var total     = selectedPack === 1 ? '₹500' : '₹1,350';
  var tp = document.getElementById('tyPack'); if (tp) tp.textContent = packLabel;
  var tt = document.getElementById('tyTotal'); if (tt) tt.textContent = total;
  var ck = document.getElementById('checkout');
  if (ck) ck.scrollIntoView({ behavior: 'smooth' });
  setTimeout(function () {
    var cs = document.getElementById('crossSell');
    if (cs) cs.style.display = 'flex';
  }, 3000);
}

// Upsell actions
function acceptUpsell() {
  var ub = document.getElementById('upsellBanner'); if (ub) ub.style.display = 'none';
  var ua = document.getElementById('upsellAccepted'); if (ua) ua.style.display = 'block';
  var cs = document.getElementById('crossSell'); if (cs) cs.style.display = 'flex';
}
function declineUpsell() {
  var ub = document.getElementById('upsellBanner'); if (ub) ub.style.display = 'none';
  var cs = document.getElementById('crossSell'); if (cs) cs.style.display = 'flex';
}

// Card number auto-format
document.addEventListener('DOMContentLoaded', function () {
  var cardInput = document.getElementById('cardnum');
  if (cardInput) {
    cardInput.addEventListener('input', function () {
      var val = this.value.replace(/\D/g, '').substring(0, 16);
      this.value = val.replace(/(.{4})/g, '$1  ').trim();
    });
  }
  var expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', function () {
      var val = this.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) val = val.substring(0, 2) + ' / ' + val.substring(2);
      this.value = val;
    });
  }

  // FAQ toggle
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var a = q.nextElementSibling;
      var isOpen = a.style.display === 'block';
      document.querySelectorAll('.faq-a').forEach(function (x) { x.style.display = 'none'; });
      document.querySelectorAll('.faq-q span').forEach(function (x) { x.textContent = '+'; });
      if (!isOpen) {
        a.style.display = 'block';
        q.querySelector('span').textContent = '−';
      }
    });
  });
});
