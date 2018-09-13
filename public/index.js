ZiggeoApi.token = "d3dbfe43917210b2299fe55163942550";

ZiggeoApi.Events.on("submitted", (data) => {
  fetch("/process-video", {
    credentials: 'include',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      videoToken: data.video.token
    }),
  }).then((res) => res.json())
    .then((myJson) => {

      let msg;
      if (myJson.videoToken !== data.video.token) msg = `Based on my calculations, you <span class="name-color">DID</span> smile in the video. Watch below to see my proof!`;
      else msg = `Based on my calculations, you did <span class="name-color">NOT</span> smile in the video. Watch below to see my proof!`;

      let elementToDisplay = document.getElementById('elementToDisplay');

      // todo: change href link
      elementToDisplay.innerHTML = `
      <div class="item">
      <div class="title">${msg}</div>
      <div id="item">
      <ziggeo ziggeo-video="${myJson.videoToken}" ziggeo-width=640 ziggeo-height=480></ziggeo>
      <a href="https://ziggeocc.garagescript.org/" class="btn back-btn btn-lg active" role="button" aria-pressed="true">Try again!</a>
      </div>
      </div>
    `;
    });
});

