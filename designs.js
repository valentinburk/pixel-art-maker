$(function(){
  // Constants
  const FADE_DURATION = 300;
  const DEFAULT_COLOR = '#fff';

  // Current Color
  let currentColor = '#3498db';

  // Page elements
  let setup = $('#setup');
  let layout = $('#layout');
  let buttons = $('#control-buttons');
  let form = $('#size-picker');
  let canvas = $('#pixel-canvas');
  let color = $('#color-picker');

  let showRules = $("#show-instructions");
  let closeRules = $("#close-instructions");
  let rules = $("#instructions");

  let clearButton = $('#clear');
  let resetButton = $('#reset');

  /**
  * @description Sets color of element in the canvas
  * @param {object} element - The object to set color on
  * @param {string} color - Hexadecimal value of the color to set
  */
  function setColor(element, color){
    $(element).css('background-color', color);
  };

  /**
  * @description Draws the canvas using provided parameters
  * @param {int} height - The height of the canvas
  * @param {int} width - The width of the canvas
  */
  function makeGrid(height, width) {
    color.farbtastic(function(e) {
      currentColor = e;
    });

    let h = 0;
    while (h++ < height) {
      var tr = $('<tr></tr>');

      for (let w = 0; w < width; w++) {
        tr.append('<td></td');
      }

      canvas.append(tr);
    }

    setup.fadeOut(FADE_DURATION, function() {
      layout.fadeIn(FADE_DURATION);
      buttons.fadeIn(FADE_DURATION);
    });
  };

  /**
  * @description Resets color of all cells
  */
  function clearCanvas() {
    canvas.find('td').each(function() {
      setColor(this, DEFAULT_COLOR);
    })
  };

  // Listen event to show instructions
  showRules.on('click', function() {
    showRules.fadeOut(FADE_DURATION / 2, function() {
      rules.fadeIn(FADE_DURATION / 2);
    })
  });

  // Listen event to hide instructions
  closeRules.on('click', function() {
    rules.fadeOut(FADE_DURATION / 2, function() {
      showRules.fadeIn(FADE_DURATION / 2);
    })
  });

  // Set color by click
  canvas.on('click', 'td', function() {
    setColor(this, currentColor);
  })

  // This function is used for possibility to draw
  // smoothly on the canvas with a single mouse hold
  // Reset color by moving cursor with right button down
  canvas.on('mousemove', 'td', function(e) {
    e.preventDefault();
    if (e.buttons == 1 || e.buttons == 3) {
      setColor(this, currentColor);
    }
    else if (e.buttons == 2) {
      setColor(this, DEFAULT_COLOR);
    }
  });

  // Reset color by right click
  canvas.on('contextmenu', 'td', function(e) {
    e.preventDefault();
    setColor(this, DEFAULT_COLOR);
  });

  // Apply canvas size set by user
  form.submit(function(e){
    e.preventDefault();

    // Remember values of canvas parameters
    let height = $('#input-height').val();
    let width = $('#input-width').val();

    // Alert if the canvas is too small
    if (height < 2 || width < 2) {
      alert('Canvas size must be at least 2x2');
      return;
    }

    // Apply
    makeGrid(height, width);
  });

  // Clear the drawing area
  clearButton.on('click', function() {
    clearCanvas();
  });

  // Delete current drawing area and let user to
  // set his new canvas to draw
  resetButton.on('click', function() {
    buttons.fadeOut(FADE_DURATION);
    layout.fadeOut(FADE_DURATION, function() {
      canvas.children().remove();
      setup.fadeIn(FADE_DURATION);
    });
  });
});
