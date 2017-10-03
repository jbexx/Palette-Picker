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
    $(`.color${num}`).css('background-color', color)
    $(`.hex-code${num}`).text( color )
}

$(document).ready( () => {
   for (var i = 0; i < 6; i++) {
        setColorBar(i)
    }
})

$('.color-container').click( '.lock-icon', () => {
    const src = $(event.target)
    
    if(src.attr('src') === './assets/unlock.svg') {
        src.attr('src', './assets/padlock.svg')
    } else {
        src.attr('src', './assets/unlock.svg')
    }
})

$('.color-container').on('keyup', '.hex-code', () => {
    const src = $(event.target)
    const srcColor = src.text()
    console.log(src.css())
    src.css('.background-color', srcColor)
})
       