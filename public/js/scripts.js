const makeColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

const setColorBar = (num) => {
    const color = makeColor();

    if (!$(`.color${num}`).hasClass('locked')) {
        $(`.color${num}`).css('background-color', color)
        $(`.hex-code${num}`).text( color )
    }
}

const colorLoop = () => {
    for (var i = 0; i < 6; i++) {
        setColorBar(i)
    }
}

const toggleLock = (e) => {
    const src = $(e.target)
    
    if(src.attr('src') === './assets/unlock.svg') {
        src.attr('src', './assets/padlock.svg')
        src.closest('.color').toggleClass('locked')
    } else {
        src.attr('src', './assets/unlock.svg')
        src.closest('.color').toggleClass('locked')
    }
}

const changeColor = (e) => {
    const src = $(e.target);
    const srcColor = src.text();
    src.closest('.color').css('background-color', `${srcColor}`)
}

const addProject = (name) => {
    $('.dropdown-content').append(`<p class='drop-project'>${name}</p>`)
}

const setProjects = (projects) => {
    for (let i = 0; i < projects.length; i++) {
        addProject(projects[i].project_name)
    }
}

const getProjects = () => {
    fetch('/api/v1/projects')
    .then( response => response.json())
    .then( data => setProjects(data))
}

const getReady = () => {
    getProjects();
    colorLoop();
}

const palettePost = () => {
    const paletteBody = {
        name: $('.palette-inpt').val(),
        hex1: $('.color1').css('background-color'),
        hex2: $('.color2').css('background-color'),
        hex3: $('.color3').css('background-color'),
        hex4: $('.color4').css('background-color'),
        hex5: $('.color5').css('background-color'),
        project_id: 2
    };

    fetch('/api/v1/palettes', {
        method: 'POST',
        body: JSON.stringify(paletteBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( data => data.json())
    .then( data => console.log(data))
    .catch( err => console.log(err))
}

const projectPost = () => {
    fetch('/api/v1/projects', {
        method: 'POST',
        body: JSON.stringify({ project_name: $('.project-inpt').val() }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( data => data.json())
    .then( data => addProject(data[0].project_name))
    .catch( err => console.log(err))
}

const enableBtns = () => {
    $('.palette-inpt').val() !== '' ? $('.save-plt-btn').attr('disabled', false) : $('.save-plt-btn').attr('disabled', true);
    $('.project-inpt').val() !== '' ? $('.save-prj-btn').attr('disabled', false) : $('.save-prj-btn').attr('disabled', true);
}

$(document).ready( () => getReady());

$('.color-container').click( '.lock-icon', (e) => toggleLock(e));

$('.color-container').on('keyup', '.hex-code', (e) => changeColor(e));

$('.new-palette').click( (e) => {
    e.preventDefault(); 
    colorLoop();
});

$('.save-plt-btn').click( (e) => {
    e.preventDefault();
    palettePost();
});

$('.save-prj-btn').click( (e) => {
    e.preventDefault();
    projectPost();
})

$('.palette-inpt').on('keyup', enableBtns);

$('.project-inpt').on('keyup', enableBtns);
       