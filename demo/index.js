/* globals document window PBrute */

function addComment(container, text) {
  const li = document.createElement('li');
  li.innerHTML = text;
  container.append(li);
}

function main() {
  const input = document.querySelector('#password');
  const comments = document.querySelector('#comments');

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

    console.log(result);

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
      addComment(comments, `<p>${algorithm}</p><p>${result.time[algorithm]} ms</p>`);
  });
}

window.addEventListener('load', main);
