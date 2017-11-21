$(function(){
  // Constants
  const fadeDuration = 300;
  const defaultColor = '#fff';

  // Current Color
  let currentColor = '#3498db';

  // Page elements
  let setup = $('#setup');
  let layout = $('#layout');
  let buttons = $('#control-buttons');
  let form = $('#size-picker');
  let canvas = $('#pixel-canvas');
  let color = $('#color-picker');

  let showRules = $("#show-rules");
  let closeRules = $("#close-rules");
  let rules = $("#rules");

  let clearButton = $('#clear');
  let resetButton = $('#reset');

  // Set color of element in the canvas
  function setColor(element, color){
    $(element).css('background-color', color);
  };

  // Draw the canvas of provided parameters
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

    setup.fadeOut(fadeDuration, function() {
      layout.fadeIn(fadeDuration);
      buttons.fadeIn(fadeDuration);
    });
  };

  function clearCanvas() {
    canvas.find('td').each(function() {
      setColor(this, defaultColor);
    })
  };

  showRules.on('click', function() {
    showRules.fadeOut(fadeDuration / 2, function() {
      rules.fadeIn(fadeDuration / 2);
    })
  });

  closeRules.on('click', function() {
    rules.fadeOut(fadeDuration / 2, function() {
      showRules.fadeIn(fadeDuration / 2);
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
      setColor(this, defaultColor);
    }
  });

  // Reset color by right click
  canvas.on('contextmenu', 'td', function(e) {
    e.preventDefault();
    setColor(this, defaultColor);
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

  clearButton.on('click', function() {
    clearCanvas();
  });

  resetButton.on('click', function() {
    buttons.fadeOut(fadeDuration);
    layout.fadeOut(fadeDuration, function() {
      canvas.children().remove();
      setup.fadeIn(fadeDuration);
    });
  });
});
