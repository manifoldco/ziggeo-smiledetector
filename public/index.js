ZiggeoApi.token = "d3dbfe43917210b2299fe55163942550";

var init = () => {
  var element = document.getElementById('ziggeo-recorder');
  var embedding = ZiggeoApi.V2.Recorder.findByElement(element);

  embedding.on("processed", (data) => {
    let elementToDisplay = document.getElementById('elementToDisplay');
    let msg = "Calculating!"
    elementToDisplay.innerHTML = `
    <div class="item">
    <div class="title">${msg}</div>
    <div id="item">
    </div>
    </div>
  `;
    fetch("/process-video", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoToken: embedding.get('video')
      }),
    }).then((res) => res.json())
      .then((myJson) => {

        let msg;
        if (myJson.smile == true) msg = `Based on my calculations, you <span class="name-color">DID</span> smile in the video. Watch below to see my proof!`;
        else msg = `Based on my calculations, you did <span class="name-color">NOT</span> smile in the video. Watch below to see my proof!`;

        let elementToDisplay = document.getElementById('elementToDisplay');

        // todo: change href link
        elementToDisplay.innerHTML = `
        <div class="item">
        <div class="title">${msg}</div>
        <div id="item">
        <ziggeoplayer ziggeo-video="${myJson.videoToken}" ziggeo-width=640 ziggeo-height=480></ziggeoplayer>
        <a href="/" class="btn back-btn btn-lg active" role="button" aria-pressed="true">Try again!</a>
        </div>
        </div>
      `;
      });
  });
}