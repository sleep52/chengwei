// 潮闻 app 共用：登录门（账号密码来自论坛第一楼）
document.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('login-gate');
  if (!gate) return;

  const page = document.body.dataset.page || 'social';
  GameState.set('currentAct', 1);
  GameState.set('pageVisited_' + page, true);

  const errEl = document.getElementById('lg-err');
  const hintEl = document.getElementById('lg-hint');
  let tries = 0;

  if (GameState.get('usedSocialLogin')) gate.classList.add('hidden');

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('lg-u').value.trim().toLowerCase();
    const pass = document.getElementById('lg-p').value.trim();

    if (user === 'ashui_2001' && pass === 'chaochao2001') {
      GameState.set('usedSocialLogin', true);
      GameState.recordClue('social_login');
      gate.classList.add('hidden');
      return;
    }

    tries++;
    errEl.textContent = '账号或密码不对';
    if (tries >= 3) {
      hintEl.classList.add('show');
      errEl.textContent = '账号或密码不对。再错就锁了。';
    }
  });
});
