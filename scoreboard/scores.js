window.onload = function() {
  scoreboard = document.getElementById("scrbrd");
  scoreboard.innerHTML += `<div class="record vpn">
            <ul>
            <li id="vpn_alert">turn on your vpn!</li>
            </ul>
            </div>`;
  connect_database();
};

function connect_database() {
  var scores_ref = database.ref("scores");
  scores_ref.on("value", function(snapshot) {
    //console.log(snapshot.key, snapshot.val());
    show_records(snapshot.val());
  });
}

function show_records(scores_object) {
  var scores_list = Object.keys(scores_object).map(i => scores_object[i]);
  scores_list.sort((a, b) => (a.score < b.score ? 1 : -1));
  scoreboard.innerHTML = "";
  for (let record of scores_list) {
    scoreboard.innerHTML += `
            <div class="record" ${record.name === userName ? 'id="own"' : ""}>
            <ul>
            <li class="left">${record.name}</li>
            <li class="center">${record.date}</li>
            <li class="right">score : ${record.score}</li>
            </ul>
            </div>
            <hr>
            `;
  }
}
