let createPicDiv = function (args) {
    console.log('args: ', args.width);
    let projectBox = document.createElement('a');
    projectBox.classList.add('thumb-link');
    projectBox.setAttribute('href', args.href);
    let projectPic = document.createElement('div');
    let techsUsed = Object.values(args.tech);

    projectPic.classList.add('element-item', ...techsUsed);
    projectPic.style = 'background-image: url(' + args.url + ');';
    projectPic.setAttribute('data-picwidth', args.width);
    projectPic.setAttribute('data-picheight', args.height);

    let projectText = document.createElement('p');
    projectText.classList.add('post-title');
    projectText.innerHTML = args.title + '<br><span class="tech-used">' + techsUsed.toString()
        .replace(/,/g, ', ') + '</span>';
    projectPic.appendChild(projectText);
    projectBox.appendChild(projectPic);
    let picGrid = document.querySelector('.grid');
    picGrid.appendChild(projectBox);

    picGrid.dispatchEvent(projectBoxCreatedEvent);
};

let getPicDimensions = function (args, callback) {
    let width = 2;
    let height = 2;

    let img = new Image();
    img.addEventListener('load', function () {
        args.width = img.width;
        args.height = img.height;
        console.log('loading');
        return callback(args);
    });
    img.src = args.url;
};

let projects = [{
        title: 'Dark Horse Woodworks, Inc.',
        href: 'projects/darkhorse/',
        tech: ['wp', 'php', 'html'],
        url: 'http://www.boothwebproduction.com/wp-content/uploads/2016/02/darkhorsewoodworks_thumbnail01.jpg',
        order: 1
    },
    {
        title: 'Theatre in the Square',
        href: 'projects/theatre-in-the-square/',
        tech: ['wp', 'php', 'html'],
        url: 'http://www.boothwebproduction.com/wp-content/uploads/2016/02/theatreinthesquare_thumbnail01.jpg',
        order: 2
    },
    {
        title: 'The Naked Crepe',
        href: 'projects/the-naked-crepe/',
        tech: ['wp', 'php', 'html'],
        url: 'http://www.boothwebproduction.com/wp-content/uploads/2016/02/thenakedcrepe_thumbnail01.jpg',
        order: 3
    },
    {
        title: 'Whitman Publishing map/timeline app',
        href: 'projects/whitman-publishing/',
        tech: ['js', 'html'],
        url: 'img/whitman-timeline-app.png',
        order: 4
    }
];
let projectBoxCreatedEvent = new Event('projectBoxCreated');
let setUpProjectThumbs = new Promise((resolve, reject) => {
    let counter = 0;

    function incrementCounter() {
        counter++;
        console.log(counter);
        if (counter === projects.length) {
            console.log('All images loaded!');
            loadScript('js/isotope-section.js', function () {
                initIsotope(); // initIsotope is callback; will run after loadscript finishes
            });
        }
    }
    for (let i = 0; i < projects.length; i++) {
        getPicDimensions(projects[i], createPicDiv);
        document.querySelector('.grid').addEventListener('projectBoxCreated',
            incrementCounter, false);
    }
    resolve('success');
    reject('failed');
});










// #######################  GALLERY THUMBNAILS  #######################
    // init Isotope
    function loadScript(url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("body")[0].appendChild(script);
    }

    let initIsotope = function () {
        let firstTime = true;
        let thumbs = document.querySelectorAll('.element-item'),
            thumbsH = thumbs[0].offsetHeight,
            galleryContainer = document.getElementById('gallery-container'),
            galleryGrid = document.querySelectorAll('.grid');
        if (galleryContainer.offsetWidth > 1450) {
            galleryGrid[0].style.width = '1450px';
        }

        let resizeThumbs = new Promise((resolve, reject) => {
            console.log('resizethumbs:');
            let thisPicWidth;
            for (i = 0; i < thumbs.length; i++) {
                thisPicWidth = ((thumbs[i].dataset.picwidth / thumbs[i].dataset.picheight) * thumbsH);
                thumbs[i].style.width = thisPicWidth + 'px';
            }
            resolve('success');
            reject('failed');
        });

        iso.on('arrangeComplete', function () {
            console.log('arrangeComplete');
            centerThumbRows();
        });

        document.addEventListener('DOMContentLoaded', function (event) {
            console.log('DOMContentLoaded');
            centerThumbRows();
        });

        let resizeTimer;
        window.addEventListener('resize', function (e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                centerThumbRows();
            }, 650);
        });

        function centerThumbRows() {
            resizeThumbs.then((msg) => {
                    let thumbItems = [];
                    for (a = 0; a < thumbs.length; a++) {
                        var thumbStyle = window.getComputedStyle(thumbs[a]),
                            thumbDisplay = thumbStyle.getPropertyValue('display');
                        console.log('display: ' + thumbDisplay);
                        if (thumbDisplay == 'block') {
                            thumbItems.push(thumbs[a]);
                        }
                    }


                    var innerGridWidth = galleryGrid[0].offsetWidth;

                    var rowStarters = [];
                    for (i = 0; i < thumbItems.length; i++) {
                        if (i > 1 && thumbItems[i].offsetLeft < 10) {
                            rowStarters.push(thumbItems[i - 1]);
                        }
                    }
                    rowStarters.push(thumbItems[thumbItems.length - 1]);
                    var rowPadding = [];
                    for (j = 0; j < rowStarters.length; j++) {
                        var lastThumbLeft = rowStarters[j].offsetLeft,
                            lastThumbWidth = rowStarters[j].offsetWidth;
                        rowPadding[j] = (innerGridWidth - (lastThumbLeft + lastThumbWidth)) / 2;
                    }
                    var n = 0,
                        thumbOffsetLeft;
                    for (t = 0; t < thumbItems.length; t++) {
                        thumbOffsetLeft = thumbItems[t].offsetLeft + rowPadding[n];
                        //thumbItems[t].style.left = thumbOffsetLeft + 'px';
                        thumbItems[t].style.transform = 'translateX(' + rowPadding[n] + 'px)';
                        thumbItems[t].style.transition = 'transform 400ms ease-out';
                        if (thumbItems[t] == rowStarters[n]) {
                            n++;
                        }
                    }
                    console.log('centerthumbs: ' + msg);
                })
                .catch((msg) => {
                    console.log('resizethumbs failed');
                });
        }
        if (firstTime === true) {
            console.log('first');
            document.querySelector('button[data-filter="*"]').click();
            firstTime = false;
        }
    }; // end initIsotope

    setUpProjectThumbs.then((msg) => {
        console.log('msg: ' + msg);
    });