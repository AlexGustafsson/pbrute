/* globals document window PBrute navigator */

function addComment(container, text) {
  const li = document.createElement('li');
  li.innerHTML = text;
  container.append(li);
}

function main() {
  const input = document.querySelector('#password');
  const comments = document.querySelector('#comments');

  const matches = navigator.userAgent.match(/(Chrome|Firefox)\/([^ .]+)/);
  let hasSupportedBrowser = false;
  if (matches) {
    const [browser, version] = matches.slice(1, 3);
    const hasSupportedChrome = browser === 'Chrome' && Number(version) >= 67;
    const hasSupportedFirefox = browser === 'Firefox' && Number(version) >= 68;
    hasSupportedBrowser = hasSupportedChrome || hasSupportedFirefox;
  }

  if (!hasSupportedBrowser) {
    const unsupportedNotice = document.querySelector('#unsupported-notice');
    unsupportedNotice.classList.remove('hide');
  }

  const pbrute = new PBrute();

  let password = '';
  input.addEventListener('keyup', () => {
    if (input.value === password)
      return;

    // Clear children
    while (comments.lastChild)
      comments.removeChild(comments.lastChild);

    password = input.value;
    if (password === '')
      return;

    const result = pbrute.calculate(password);

    // Add times
    addComment(comments, `<p>Optimistic cracking time</p><p>${result.optimistic}</p>`);
    addComment(comments, `<p>Pessimistic cracking time </p><p>${result.pessimistic}</p>`);
    addComment(comments, `<p>Likely cracking time</p><p>${result.likely}</p>`);

    // Add comments
    for (const comment of result.messages)
      addComment(comments, `<p>Comment on ${comment.type}</p><p>${comment.text}</p>`);

    // Add combinations
    addComment(comments, `<p>Combinations</p><p>${result.combinations}</p>`);

    // Add algorithm times
    for (const algorithm of Object.keys(result.time))
      addComment(comments, `<p>${algorithm}</p><p>${pbrute.humanizeTime(result.time[algorithm])}</p>`);

    addComment(comments, '<p>Occurances in the Have I Been pwnd dataset</p><input onclick="check(this)" type="button" value="check" />');
  });

  window.check = async input => {
    const occurances = await pbrute.haveIBeenPwnd(password);
    const parent = input.parentElement;
    parent.removeChild(input);

    const p = document.createElement('p');
    p.innerHTML = occurances;
    parent.append(p);
  };
}

window.addEventListener('load', main);
