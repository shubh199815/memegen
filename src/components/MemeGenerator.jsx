import React, { useState, useEffect } from "react";

const MemeGenerator = () => {
  const [inputText, setInputText] = useState({
    topText: "",
    bottomText: ""
  });
  const [buttonName, setButtonName] = useState("Fetch template")
  const [randomImage, setRandomImage] = useState(
    "https://i.imgflip.com/26am.jpg"
  );
  const [allMemeImgs, setAllMemeImgs] = useState([]);

  const handleChange = e => {
    setInputText({
      ...inputText,
      [e.target.name]: e.target.value
    });
  };
  useEffect(() => {
    if(inputText.topText.trim() !== "" || inputText.bottomText.trim() !== "")
        setButtonName("Generate meme")
    else
        setButtonName("Next Template")
  }, [inputText])
  

  const handleSubmit = e => {
    e.preventDefault();
    const randNum = Math.floor(Math.random() * allMemeImgs.length);
    const randMemeImgUrl = allMemeImgs[randNum].url;
    setRandomImage(randMemeImgUrl);
  };

  // Fetching images from imgFlip
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(response => response.json())
      .then(response => setAllMemeImgs(response.data.memes));
  }, []);

  const generateImage = () => {
    if (buttonName !== "Generate meme") return;

    let container = document.getElementById('meme');
    let templateImage = document.getElementById('template-image');
    let top = document.getElementById('top');
    let bottom = document.getElementById('bottom');
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.setAttribute('width', container.clientWidth);
    canvas.setAttribute('height', container.clientHeight);
    console.log(canvas)
    context.drawImage(templateImage, 0, 0, 640, 640);
    context.font = "36px impact";
    context.textAlign = "start";
    context.fillStyle = "white";
    context.shadowColor = 'black';
    context.shadowBlur = 15;
    context.fillText(top.innerHTML.toUpperCase(), canvas.width/2 - 90, 50);
    context.fillText(bottom.innerHTML.toUpperCase(), canvas.width/2 - 90, container.clientHeight - 50);
    context.strokeRect(0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL();
    download(dataURL);
    setInputText({
        topText: "",
        bottomText: ""
    })
  }
  
  const download = (dataURL) => {
    let link = document.createElement('a');
    link.download = 'meme.png';
    link.href = dataURL
    link.click();
  }

  return (
    <div className="meme-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="topText"
          placeholder="Add Top Text"
          value={inputText.topText.toUpperCase()}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bottomText"
          placeholder="Add Bottom Text"
          value={inputText.bottomText.toUpperCase()}
          onChange={handleChange}
        />
        <button id="generate" onClick= {generateImage}>{buttonName}</button>
      </form>
      <div id="meme" className="meme">
        <img id="template-image" src={randomImage} alt="" crossOrigin="anonymous" width={640} height={640} />
        <h2 id="top" className="top">{inputText.topText}</h2>
        <h2 id="bottom" className="bottom">{inputText.bottomText}</h2>
      </div>
    </div>
  );
};

export default MemeGenerator;