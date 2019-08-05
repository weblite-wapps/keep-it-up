const W = window.W;
var userName;
const hooks = {
  wappWillStart: start => {
    // start when both localDB and shareDB datas are ready
    W.loadData().then(data => {
      userName = data.user.name;
      start();
    });
  }
};

/* 3  main */
(function main() {
  W.setHooks(hooks);
})();
