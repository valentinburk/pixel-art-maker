$(function() {
  // Constants
  const FADE_DURATION = 300;
  const MIN_GRID_SIDE = 2;
  const MAX_GRID_SIDE = 100;
  const IMG_CELL_SIDE = 20;

  // Current Color
  let currentColor = '#3498db';

  // Grid size;
  let height;
  let width;

  // Page elements
  let setup = $('#setup');
  let layout = $('#layout');
  let buttons = $('#control-buttons');
  let form = $('#size-picker');
  let grid = $('#pixel-grid');
  let color = $('#color-picker');

  let showInstructions = $("#show-instructions");
  let closeInstructions = $("#close-instructions");
  let instructions = $("#instructions");

  let clearButton = $('#clear');
  let resetButton = $('#reset');
  let saveButton = $('#save');

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

      grid.append(tr);
    }

    setup.fadeOut(FADE_DURATION, function() {
      layout.fadeIn(FADE_DURATION);
      buttons.fadeIn(FADE_DURATION);
    });
  };

  /**
   * @description Sets color of element in the canvas
   * @param {object} element - The object to set color on
   * @param {string} color - Hexadecimal value of the color to set
   */
  function setColor(element, color) {
    $(element).css('background-color', color);
  };

  /**
   * @description Resets color of all cells
   */
  function clearGrid() {
    grid.find('td').each(function() {
      setColor(this, '');
    })
  };

  /**
   * @description Draws grid <table> html element to <canvas> html element
   * @param {object} table - JSON object representing grid state
   * @returns {node} - Returns the canvas element
   */
  function drawCanvasFromTable(table) {
    let canvas = document.createElement('canvas');
    canvas.height = table.height * IMG_CELL_SIDE;
    canvas.width = table.width * IMG_CELL_SIDE;

    let ctx = canvas.getContext('2d');

    let position = 0;
    for (let h = 0; h < table.height; h++) {
      for (let w = 0; w < table.width; w++) {
        ctx.fillStyle = table.colors[position++];
        ctx.fillRect(w * IMG_CELL_SIDE, h * IMG_CELL_SIDE, IMG_CELL_SIDE, IMG_CELL_SIDE);
      }
    }

    return canvas;
  };

  /**
   * @description Downloads the png from <canvas> html element
   * @param {node} canvas - <canvas> html element
   * @param {string} filename - Name of the file that will be downloaded
   */
  function downloadImageFromCanvas(canvas, fileName) {
    let dataURL = canvas.toDataURL();
    let download = document.getElementById('save');
    download.href = dataURL;
    download.download = fileName;
  };

  // Listen event to show instructions
  showInstructions.on('click', function() {
    showInstructions.fadeOut(FADE_DURATION / 2, function() {
      instructions.fadeIn(FADE_DURATION / 2);
    })
  });

  // Listen event to hide instructions
  closeInstructions.on('click', function() {
    instructions.fadeOut(FADE_DURATION / 2, function() {
      showInstructions.fadeIn(FADE_DURATION / 2);
    })
  });

  // Set color by click
  grid.on('click', 'td', function(e) {
    setColor(this, currentColor);
  })

  // Reset color by right click
  grid.on('contextmenu', 'td', function(e) {
    e.preventDefault();
    setColor(this, '');
  });

  // This function is used for possibility to draw
  // smoothly on the canvas with a single mouse hold
  // Reset color by moving cursor with right button down
  grid.on('mousemove', 'td', function(e) {
    e.preventDefault();
    if (e.buttons == 1 || e.buttons == 3) {
      setColor(this, currentColor);
    } else if (e.buttons == 2) {
      setColor(this, '');
    }
  });

  // Apply canvas size set by user
  form.submit(function(e) {
    e.preventDefault();

    // Remember values of canvas parameters
    height = $('#input-height').val();
    width = $('#input-width').val();

    // Alert if the canvas is too small
    if (height < MIN_GRID_SIDE || width < MIN_GRID_SIDE) {
      alert('Each canvas side size must be at least 2');
      return;
    }

    if (height > MAX_GRID_SIDE || width > MAX_GRID_SIDE) {
      alert('Each side of canvas is limited to 100');
      return
    }

    // Apply
    makeGrid(height, width);
  });

  // Clear the drawing area
  clearButton.on('click', function() {
    clearGrid();
  });

  // Delete current drawing area and let user to
  // set his new canvas to draw
  resetButton.on('click', function() {
    buttons.fadeOut(FADE_DURATION);
    layout.fadeOut(FADE_DURATION, function() {
      grid.children().remove();
      setup.fadeIn(FADE_DURATION);
    });
  });

  saveButton.on('click', function() {
    let colors = [];

    $.each(grid.find('td'), function(index, cell) {
      colors.push($(cell).css('background-color'));
    });

    let table = {
      height: height,
      width: width,
      colors: colors
    }

    let canvas = drawCanvasFromTable(table);
    downloadImageFromCanvas(canvas, 'image.png');
  });
});
