// หน้าสมัครสมาชิก
const form = document.getElementById('register-form');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.className = 'msg';
  msg.textContent = '';
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    }),
  });
  const data = await res.json();
  if (res.ok) {
    msg.className = 'msg ok';
    msg.textContent = 'สมัครสำเร็จ กำลังไปหน้า login...';
    setTimeout(() => (window.location.href = 'index.html'), 1200);
  } else {
    msg.textContent = data.error;
  }
});
