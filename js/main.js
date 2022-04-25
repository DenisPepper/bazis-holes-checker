const input = document.querySelector('#bazis-xml');
const errorElement = document.querySelector('#map');
const messageTamplate = document
  .querySelector('#error')
  .content.querySelector('.error');

const showErrorMessage = (hole, value, panel) => {
  const message = messageTamplate.cloneNode(true);
  const holeDiameter = hole.children[3].textContent;
  const holeType = hole.children[4].textContent;
  const holeDepth = hole.children[5].textContent;
  const panelName = panel.children[1].textContent;
  const panelPosition = panel.children[13].textContent;
  message.querySelector(
    'p'
  ).textContent = `поз.${panelPosition}. ${panelName} : ${holeType} / d${holeDiameter} х ${holeDepth} / ${value}`;
  errorElement.appendChild(message);
};

const checkHoles = (holes, panel) => {
  const values = new Set();
  holes.forEach((hole) => {
    const value = `x: ${hole.children[0].textContent}, y: ${hole.children[1].textContent}`;
    if (values.has(value)) {
      showErrorMessage(hole, value, panel);
    } else {
      values.add(value);
    }
  });
};

const readXMLDOM = (xmlDOM) => {
  const holesGroups = [...xmlDOM.querySelectorAll('Отверстия')];
  holesGroups.forEach((holesGroup) => {
    checkHoles([...holesGroup.children], holesGroup.parentElement);
  });
};

const getXML = (src) => {
  fetch(src)
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((data) => {
      const parser = new DOMParser();
      const xmlDOM = parser.parseFromString(data, 'application/xml');
      readXMLDOM(xmlDOM);
    })
    .catch((err) => console.log(err));
};

const clearAllMeesages = () => {
  const messages = [...document.querySelectorAll('div')];
  messages.forEach((message) => message.remove(message));
};

const whenInput = (evt) => {
  clearAllMeesages();
  const file = evt.target.files[0];
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('xml')) {
    getXML(URL.createObjectURL(file));
  }
};

input.addEventListener('input', whenInput);
