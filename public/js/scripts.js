const makeColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

const setColorBar = (num) => {
    const color = makeColor();

    if (!$(`.color${num}`).hasClass('locked')) {
        $(`.color${num}`).css('background-color', color)
        $(`.hex-code${num}`).text( color )
    }
};

const colorLoop = () => {
    for (var i = 0; i < 6; i++) {
        setColorBar(i);
    }
};

const toggleLock = (e) => {
    const src = $(e.target)
    
    if(src.attr('src') === './assets/unlock.svg') {
        src.attr('src', './assets/padlock.svg')
        src.closest('.color').toggleClass('locked')
    } else {
        src.attr('src', './assets/unlock.svg')
        src.closest('.color').toggleClass('locked')
    }
};

const changeColor = (e) => {
    const src = $(e.target);
    const srcColor = src.text();
    src.closest('.color').css('background-color', `${srcColor}`);
};

const addProject = (name, value) => {
    $('.dropbtn').append(`<option class='drop-project' value='${value}'>${name}</option>`);
};

const setProjectList = (projects) => {
    for (let i = 0; i < projects.length; i++) {
        addProject(projects[i].project_name, projects[i].id);
    }
};

const displayPalettes = (palettes) => {
    palettes.forEach( el => {
        $(`.${el.project_id}`).append(`
            <div class='whole-palette'>
                <div class='palette-header'>
                    <h4>${el.name}</h4>
                    <img src='../assets/trash.svg' alt='trash can' class='delete-btn' />
                </div>
                <div class='color-palette' data-id='${el.id}' data-colors='${JSON.stringify([el.hex1, el.hex2, el.hex3, el.hex4, el.hex5])}'>
                    <div class='color-swatch' style='background-color: ${el.hex1}' />
                    <div class='color-swatch' style='background-color: ${el.hex2}' />
                    <div class='color-swatch' style='background-color: ${el.hex3}' />
                    <div class='color-swatch' style='background-color: ${el.hex4}' />
                    <div class='color-swatch' style='background-color: ${el.hex5}' />
                </div>
            </div>
        `)
    });
};

const getPalettes = (data) => {
    data.forEach( (el, i) => {
        fetch(`/api/v1/projects/${data[i].id}/palettes`)
        .then( data => data.json())
        .then( result => displayPalettes(result))
    });
};

const displayProjects = (projects) => {
    projects.forEach( (el, i) => {
        $('.projects-palettes').append(`
            <div class='project ${el.id}'><h2>${el.project_name}</h2></div>
        `);
    });
};

const getProjects = () => {
    fetch('/api/v1/projects')
    .then( response => response.json())
    .then( data => {
        setProjectList(data);
        getPalettes(data);
        displayProjects(data);
    });
};


const readyPage = () => {
    getProjects();
    colorLoop();
};

const palettePost = () => {
    const paletteBody = {
        name: $('.palette-inpt').val(),
        hex1: $('.color1').css('background-color'),
        hex2: $('.color2').css('background-color'),
        hex3: $('.color3').css('background-color'),
        hex4: $('.color4').css('background-color'),
        hex5: $('.color5').css('background-color'),
        project_id: $('.dropbtn').val()
    };

    fetch('/api/v1/palettes', {
        method: 'POST',
        body: JSON.stringify(paletteBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( data => data.json())
    .then( data => displayPalettes(data))
    .catch( err => console.log(err));

    $('.palette-inpt').val('');    
};

const projectPost = () => {
    fetch('/api/v1/projects', {
        method: 'POST',
        body: JSON.stringify({ project_name: $('.project-inpt').val() }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( data => data.json())
    .then( data => addProject(data[0].project_name, data[0].id))
    .catch( err => console.log(err));

    $('.project-inpt').val('');
};

const pushPalette = (color) => {
    const palette = $(color).closest('.color-palette')[0];
    const paletteColors = JSON.parse($(palette).attr('data-colors'));
    
    paletteColors.forEach( (color, i) => {
        $(`.color${i + 1}`).css('background-color', color);
    });
};

const deletePalette = (target) => {
    const id = $(target).closest('.whole-palette').find('.color-palette').attr('data-id');

    fetch(`/api/v1/palettes/${id}`, {
        method: 'DELETE'
    })
    .then( () => $(`.${id}`).remove())
    .catch( err => console.log(err));

    $(target).closest('.whole-palette').remove();
};

const enableBtns = () => {
    $('.palette-inpt').val() !== '' ? $('.save-plt-btn').attr('disabled', false) : $('.save-plt-btn').attr('disabled', true);
    $('.project-inpt').val() !== '' ? $('.save-prj-btn').attr('disabled', false) : $('.save-prj-btn').attr('disabled', true);
};

$(document).ready(readyPage);
$('.palette-inpt').on('keyup', enableBtns);
$('.project-inpt').on('keyup', enableBtns);
$('.color-container').on('click', '.lock-icon', (e) => toggleLock(e));
$('.color-container').on('keyup', '.hex-code', (e) => changeColor(e));
$('.projects-palettes').on('click', '.color-palette', (e) => pushPalette(e.target));
$('.projects-palettes').on('click', '.delete-btn', (e) => deletePalette(e.target));
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
});