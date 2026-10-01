let work_exp = ['Wordpress website developer and manager']

let education = ['Student at the "Physical Therapy" department of the University of Western Attica',
'Student at the "Information Technology Applications Technician" department of the Public Thematic Institute of Vocational Training Aigaleo',
'Private daily High School "APOSTOLOS PAVLOS"'];

let seminars = ["TedxUniwa Hackathon (2021)",
"Myofascial Pain Syndrome – Dry Needling – Assessment and Treatment Organized by the Hellenic Physiotherapy Society of Algology",
"Physical Therapy and quality of life: Development – Maintenance – Recovery (2020)",
"ERC qualification Basic Life Support (BLS) Provider (2023)"];

let computers = ['Microsoft Windows XP, Microsoft Word 2003, Microsoft Excel 2003, Microsoft Access 2010, Microsoft PowerPoint 2003,<br> MS Internet Explorer, Microsoft Outlook 2010 (VELLUM diploma in IT skills).',
'Knowledge of C, C++, C#, CSS, GDScript, Go, HTML, Java, JavaScript, Kotlin, MySql, PHP, Python, R, Ruby, Swift 4.',
'Knowledge of Node.js, Tkinter, Beautiful Soup 4',
'Knowledge of Blender, FreeCAD, GIMP, Inkscape, Godot, and Wordpress',
'Knowledge of Arduino and Raspberry Pi'];

let languages = ['English ECPE (C2 level)', 'French DELF A2 (A2 level)', 'Esperanto'];

let personality = ['Inventive', 'Perfectionist', 'Loves learning'];

let interests = ['Game development', 'Embedded and hardware engineering', 'Biomedical engineering', 'Electronics', 'App development']

var mobile;
//check if the user is from mobile
document.addEventListener('DOMContentLoaded', function () {
  if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)) {
      mobile = true;
  } else {
      mobile = false;
  }

  if (mobile === true) {
      var paragraphs = document.getElementsByClassName("pparagr");
      var paragraphArray = Array.from(paragraphs);

      paragraphArray.forEach(paragraph => {
        if(paragraph.parentElement.id!="details"){
          let newParagraph = paragraph.querySelector("p");
          newParagraph.textContent = "Click the 'NEXT' button.";
          
          
          var buttons_left = document.createElement("button")
          buttons_left.innerText = "PREVIOUS"
          buttons_left.className = "clickable-button"


          var buttons_right = document.createElement("button")
          buttons_right.innerText = "NEXT"
          buttons_right.className = "clickable-button"

          paragraph.appendChild(buttons_left)
          paragraph.appendChild(buttons_right)
          }
      });
      let buttons = document.querySelectorAll(".clickable-button");

      buttons.forEach(button => {
          let parent_id = button.parentElement.parentElement.id;

          button.addEventListener("click", function () {
              
              
              cycle(parent_id, button);
          });
      });

  }
  else {

      //when the dom is loaded add an event listener to id = container for when the user hovers over a child id
      var paragraphs = document.getElementsByClassName("pparagr");
      var paragraphArray = Array.from(paragraphs);

      paragraphArray.forEach(paragraph => {
          if(paragraph.parentElement.id!="details"){
              let newParagraph = paragraph.querySelector("p");
              newParagraph.textContent = "Use the mouse wheel.";                
          }
      });
      document.getElementById('container').addEventListener('mouseover', function (event) {
          let hoveredElement = event.target;
          let elementId = hoveredElement.id;
          //don't execute the function if it is null or one of the below
          if (elementId != "" && elementId != "container" && elementId != "details" && elementId != "downloads") {
              mouse_roll(elementId);
          }

      });

  }
});

//funciton to use the mouse wheel to go through all the bullet points
function mouse_roll(elementId) {
  let scrolls = 0;
  let unscrollableSection = document.getElementById(elementId);
  unscrollableSection.addEventListener('wheel', function (event) {
      event.preventDefault();
      if (event.deltaY < 0) {
          if (scrolls > 0) {
              scrolls -= 1;
          }
      } else if (event.deltaY > 0) {
          scrolls += 1;
      }
      //class to cicle throught the text on evey class "pparagr", based on the id the mouse is on
      class ScrollableContent {
          constructor(elementId) {
              this.elementId = elementId;
              this.par = unscrollableSection.querySelector('.pparagr').querySelector("p");
          }
          //handles what text to show
          updateContent(contentArray) {
              if (scrolls === 0) {
                  this.par.innerHTML = contentArray[scrolls];
              } else {
                  this.par.innerHTML = contentArray[scrolls - 1];
              }

              if (scrolls > contentArray.length - 1) {
                  scrolls = 0;
              }
          }
          //updates only the current id
          handleScroll() {
              switch (this.elementId) {
                  case "work":
                      this.updateContent(work_exp);
                      break;
                  case "edu":
                      this.updateContent(education);
                      break;
                  case "sem":
                      this.updateContent(seminars);
                      break;
                  case "pc":
                      this.updateContent(computers);
                      break;
                  case "lang":
                      this.updateContent(languages);
                      break;
                  case "pers":
                      this.updateContent(personality);
                      break;
                  case "int":
                      this.updateContent(interests);
              }
          }
      }

      // Usage
      const scrollableContent = new ScrollableContent(elementId);
      scrollableContent.handleScroll();
  });
}

let scrolls = {};

function cycle(element, button) {
let unscrollableSection = document.getElementById(element);

if (!scrolls.hasOwnProperty(element)) {
  scrolls[element] = 0;
}

if (button.innerText === "PREVIOUS") {
  if (scrolls[element] > 0) {
    scrolls[element] -= 1;
  }
} else if (button.innerText === "NEXT") {
  scrolls[element] += 1;
}



class ScrollableContent {
  constructor(element) {
    this.element = element;
    this.par = unscrollableSection.querySelector('.pparagr').querySelector("p");
  }

  //handles what text to show
  updateContent(contentArray) {
    if (scrolls[this.element] === 0) {
      this.par.innerHTML = contentArray[scrolls[this.element]];
    } else {
      this.par.innerHTML = contentArray[scrolls[this.element] - 1];
    }

    if (scrolls[this.element] > contentArray.length - 1) {
      scrolls[this.element] = 0;
    }
  }

  //updates only the current id
  handleScroll() {
    switch (this.element) {
      case "work":
        this.updateContent(work_exp);
        break;
      case "edu":
        this.updateContent(education);
        break;
      case "sem":
        this.updateContent(seminars);
        break;
      case "pc":
        this.updateContent(computers);
        break;
      case "lang":
        this.updateContent(languages);
        break;
      case "pers":
        this.updateContent(personality);
        break;
      case "int":
        this.updateContent(interests);
    }
  }
}

// Usage
const scrollableContent = new ScrollableContent(element);
scrollableContent.handleScroll();
}