const makeColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

const setColorBar = (num) => {
    const color = makeColor()
    console.log($('.color').hasClass('locked'))
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

$(document).ready( () => colorLoop());

$('.color-container').click( '.lock-icon', () => {
    const src = $(event.target)
    
    if(src.attr('src') === './assets/unlock.svg') {
        src.attr('src', './assets/padlock.svg')
        src.closest('.color').toggleClass('locked')
    } else {
        src.attr('src', './assets/unlock.svg')
        src.closest('.color').toggleClass('locked')
        
    }
});

$('.color-container').on('keyup', '.hex-code', () => {
    const src = $(event.target);
    const srcColor = src.text();
    src.closest('.color').css('background-color', `${srcColor}`)
});

$('.new-palette').click( (e) => {
    e.preventDefault(); 
    colorLoop();
});
       