let work_exp = ['Κατασκευή και συντήρηση διάφορων ιστοσελιδών μέσω wordpress']
let education = ['Φοιτητής τμήματος "Φυσικοθεραπείας" του Πανεπηστημίου Δυτικής Αττικής.', 'Σπουδαστής τμήματος "Τεχνικός Εφαρμογών Πληροφορικής" του Δημόσιου Θεματικού Ι.Ε.Κ Αιγάλεω.', 'Ιδιωτικό ημερήσιο ΓΕΛ “ΑΠΟΣΤΟΛΟΣ ΠΑΥΛΟΣ”']
let seminars = ["TedxUniwa Hackathon (2021)",
"Myofascial Pain Syndrome – Dry Needling – Assessment and Treatment Organized by the Hellenic Physiotherapy Society of Algology",
    "Φυσικοθεραπεία και ποιότητα ζωής: Ανάπτυξη – Διατήρηση – Επανάκτηση (2020)",
    "ERC qualification Basic Life Support (BLS) Provider (2023)",];
let computers = ['Microsoft windows xp, Microsoft word 2003, Microsoft excel 2003, Microsoft access 2010, Microsoft power point 2003,<br> MS internet explorer, Microsoft outlook 2010 (VELLUM diploma in IT skills).',
    'Γνώση C, C++, C#, CSS, GDScript, Go, HTML, Java, JavaScript, Kotlin, MySql, PHP, Python, R, Ruby, Swift4.',
    'Γνώση Node js, Tkinter, Beautiful soup 4',
    'Γνώση Blender, Freecad, Gimp, Inkscape, Godot και Wordpress',
    'Γνώση arduino και raspberry pi']
let languages = ['Αγγλικά ECPE (επίπεδο C2)', 'Γαλλικά DELF Α2 (επίπεδο A2)', 'Εσπεράντο']
let personality = ['Εφευρετικός', 'Τελειομανής', 'Φιλομαθής']
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
            newParagraph.textContent = "Πατήστε το 'ΕΠΟΜΕΝΟ' κουμπί.";
            
            
            var buttons_left = document.createElement("button")
            buttons_left.innerText = "ΠΡΟΗΓΟΥΜΕΝΟ"
            buttons_left.className = "clickable-button"


            var buttons_right = document.createElement("button")
            buttons_right.innerText = "ΕΠΟΜΕΝΟ"
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
                newParagraph.textContent = "Χρησιμοποιήστε τον τροχό του ποντικιού.";                
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

  if (button.innerText === "ΠΡΟΗΓΟΥΜΕΝΟ") {
    if (scrolls[element] > 0) {
      scrolls[element] -= 1;
    }
  } else if (button.innerText === "ΕΠΟΜΕΝΟ") {
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